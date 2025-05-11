import './globals.css'
import {ReactQueryProvider} from './providers'
import Navbar from "@/components/Navbar";
import {SidebarProvider} from "@/components/ui/sidebar";

export const metadata = {
    title: 'Mon App',
    description: 'Next.js + React-Query',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="fr">
        <body>
        <ReactQueryProvider>
            <Navbar/>
            <SidebarProvider>
                {children}
            </SidebarProvider>
        </ReactQueryProvider>
        </body>
        </html>
    )
}
