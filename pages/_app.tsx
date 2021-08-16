import type { AppProps } from 'next/app'
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from "react-alert-template-basic";


function MyApp({ Component, pageProps }: AppProps) {
  const options = {
    position: positions.BOTTOM_RIGHT,
    offset: '30px',
    transition: transitions.SCALE,
    template: AlertTemplate
  }
  return (
    <AlertProvider {...options}>
      <Component {...pageProps} />
    </AlertProvider>
  )
}
export default MyApp
