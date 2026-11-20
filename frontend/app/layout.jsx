import '../src/styles.css';

export const metadata = {
    title: 'Trazo',
    description: 'Centro de operaciones'
};

export default function RootLayout({ children }) {
    return <html lang="es"><body>{children}</body></html>;
}
