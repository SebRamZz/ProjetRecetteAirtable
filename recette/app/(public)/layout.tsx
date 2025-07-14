"use client";

export default function PublicLayout({
                                         children,
                                     }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 h-screen">{children}</div>
    );
}
