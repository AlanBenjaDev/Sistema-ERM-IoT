import './globals.css'

export const metadata = {
  title: 'Pipeline ETS Control Empresarial',
  description: 'Asesoramiento legal corporativo y particular con base en Córdoba. Defendemos sus derechos con profesionalismo y compromiso. Especialistas en Derecho Laboral, Civil, Comercial y Familia.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="bg-slate-50 text-slate-800 antialiased">
        {children}
      </body>
    </html>
  )
}