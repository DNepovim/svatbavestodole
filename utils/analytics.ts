import Analytics from 'analytics'
import googleAnalytics from '@analytics/google-analytics'

export const analytics = Analytics({
  app: 'vezmemesevestodole.cz',
  plugins: [
    googleAnalytics({
      trackingId: process.env.NEXT_PUBLIC_GA_ID
    })
  ]
})