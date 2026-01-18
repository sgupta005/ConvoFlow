import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 p-6 md:p-10 min-h-svh">
      <div className="flex justify-center gap-2 md:justify-start">
        <a href="#" className="flex items-center gap-2 font-medium">
          <Image src="/logo.svg" alt="ConvoFlow" width={32} height={32} />
          ConvoFlow
        </a>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xs">{children}</div>
      </div>
    </div>
  );
}
