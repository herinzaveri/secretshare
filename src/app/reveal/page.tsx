'use client';
import {useEffect, useState} from 'react';
import {ClipboardDocumentCheckIcon, ClipboardDocumentIcon, Cog6ToothIcon} from '@heroicons/react/24/outline';
import {ErrorMessage} from '@/components/error';
import {Title} from '@/components/title';
import Link from 'next/link';
import axios from 'axios';
import {decryptText} from '@/utils/encryption';

const Page = () => {
  const [compositeKey, setCompositeKey] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCompositeKey(window.location.hash.replace(/^#/, ''));
    }
  }, []);

  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [remainingReads, setRemainingReads] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const onSubmit = async () => {
    try {
      setError(null);
      setText(null);
      setLoading(true);

      if (!compositeKey) {
        throw new Error('No id provided');
      }

      if (!compositeKey.includes('-')) {
        throw new Error('Invalid id');
      }

      const [id, key] = compositeKey.split('-');

      const {data} = await axios.get('/api/messages', {
        params: {
          id: id,
        },
      });

      const {encryptedText, iv, maxReads, reads} = data;

      setRemainingReads(maxReads - reads);

      const {decryptedText} = await decryptText(encryptedText, key, iv);

      setText(decryptedText);
    } catch (e) {
      console.error(e);
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const generateKey = (index: number) => `key-${index}`;

  return (
    <div className="container px-8 mx-auto mt-16 lg:mt-32 ">
      {error ? <ErrorMessage message={error} /> : null}
      {text ? (
        <div className="max-w-4xl mx-auto">
          {remainingReads !== null ? (
            <div className="text-sm text-center text-zinc-600">
              {remainingReads > 0 ? (
                <p>
                  This message can be read <span className="text-zinc-100">{remainingReads}</span> more times.
                </p>
              ) : (
                <p className="text-zinc-400">
                  This was the last time this message could be read. It was deleted from storage.
                </p>
              )}
            </div>
          ) : null}
          <pre className="px-4 py-3 mt-8 font-mono text-left
            bg-transparent border rounded border-zinc-600
            focus:border-zinc-100/80 focus:ring-0 sm:text-sm text-zinc-100"
          >
            <div className="flex items-start px-1 text-sm">
              <div aria-hidden="true" className="pr-4 font-mono border-r select-none border-zinc-300/5 text-zinc-700">
                {Array.from({
                  length: text.split('\n').length,
                }).map((_, index) => (
                  <span key={generateKey(index)}>
                    {(index + 1).toString().padStart(2, '0')}
                    <br />
                  </span>
                ))}
              </div>
              <div>
                <pre className="flex overflow-x-auto">
                  <code className="px-4 text-left">{text}</code>
                </pre>
              </div>
            </div>
          </pre>

          <div className="flex items-center justify-end gap-4 mt-4">
            <Link
              href="/share"
              type="button"
              className="relative inline-flex items-center
                px-4 py-2 -ml-px space-x-2 text-sm font-medium duration-150
                border rounded text-zinc-300 border-zinc-300/40 hover:border-zinc-300
                focus:outline-none hover:text-white"
            >
              Share another
            </Link>
            <button
              type="button"
              className="relative inline-flex items-center px-4 py-2 -ml-px
                space-x-2 text-sm font-medium duration-150 border rounded
                text-zinc-700 border-zinc-300 bg-zinc-50 hover focus:border-zinc-500
                focus:outline-none hover:text-zinc-50 hover:bg-zinc-900"
              onClick={() => {
                navigator.clipboard.writeText(text);
                setCopied(true);
              }}
            >
              {copied ? (
                <ClipboardDocumentCheckIcon className="w-5 h-5" aria-hidden="true" />
              ) : (
                <ClipboardDocumentIcon className="w-5 h-5" aria-hidden="true" />
              )}{' '}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      ) : (
        <form
          className="max-w-3xl mx-auto "
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <Title>Reveal Secret</Title>

          <div className="px-3 py-2 mt-8 border rounded border-zinc-600
            focus-within:border-zinc-100/80 focus-within:ring-0 "
          >
            <label htmlFor="id" className="block text-xs font-medium text-zinc-100">
              ID
            </label>
            <input
              type="text"
              name="compositeKey"
              id="compositeKey"
              className="w-full p-0 text-base bg-transparent border-0
                appearance-none text-zinc-100 placeholder-zinc-500 focus:ring-0 sm:text-sm"
              value={compositeKey}
              onChange={(e) => setCompositeKey(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={
              `mt-8 w-full h-12 inline-flex justify-center items-center  
              transition-all  rounded px-4 py-1.5 md:py-2 text-base font-semibold leading-7 
              text-zinc-800   bg-zinc-200 ring-1  duration-150  hover:text-black 
              hover:drop-shadow-cta   hover:bg-white ${
                loading ? 'animate-pulse' : ''
              }`
            }
          >
            <span>{loading ? <Cog6ToothIcon className="w-5 h-5 animate-spin" /> : 'Reveal'}</span>
          </button>
        </form>
      )}
    </div>
  );
};

export default Page;
