/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { css, Global, SerializedStyles } from '@emotion/react'
import Head from 'next/head'
import Image from 'next/image'
import srcOznameni from '../images/oznameni.jpg'
import strom1 from '../images/strom1.jpg'
import strom2 from '../images/strom2.jpg'
import strom3 from '../images/strom3.jpg'
import strom4 from '../images/strom4.jpg'
import { ParticipantForm } from '../components/ParticipantForm/ParticipantForm'
import { numberToTime } from '../utils/numberToTime'

export const colors = {
  brand: "#298447",
  light: "#29844722",
}

interface PictureProps {
  src: StaticImageData
  onHoverSrc?: StaticImageData
  alt: string
  css?: SerializedStyles
}

const Picture: React.FC<PictureProps> = ({onHoverSrc, ...props}) => {
  if (!onHoverSrc) {
    return <Image {...props} />
  }

  return <HoverPicture onHoverSrc={onHoverSrc} {...props} />
}

interface HoverPictureProps {
  src: StaticImageData
  onHoverSrc: StaticImageData
  alt: string
  css?: SerializedStyles
}

const HoverPicture: React.FC<HoverPictureProps> = ({src, onHoverSrc, alt, css}) => {
  const [currentSrc, setCurrentSrc] = useState(src)
  return <Image src={currentSrc} alt={alt} css={css} onMouseEnter={() => {setCurrentSrc(onHoverSrc)}} onMouseLeave={() => setCurrentSrc(src)} />
}

enum Venues {
  church = "kostel",
  tea = "čajovna",
  stage = "pódium",
  courtyard = "nádvoří"
}

const plan = [
  {
    startTime: 11,
    title: "Obřad",
    venue: Venues.church

  },
  {
    startTime: 12,
    title: "Gratulace a focení",
    venue: Venues.courtyard
  },
  {
    startTime: 13,
    title: "Oběd",
    description: "Pro svatebčany bude na kostelní zahradě připravený guláš, boršč a nějký ten salát aby nehladověli zatím co se rodina bude nacpávat na faře.",
    venue: Venues.courtyard
  },
  {
    startTime: 15,
    title: "Zakrojení dortu",
    venue: Venues.courtyard
  },
  {
    startTime: 16,
    title: "Koncert Marie Bláhové a Radky Dimitrovové",
    description: "Písnička, písnička, písnička...",
    venue: Venues.church
  },
  {
    startTime: 20,
    title: "Tanec"
  }
]

type TitleLevel = 1 | 2 | 3

const Title: React.FC<{children: string; level: TitleLevel, image?: StaticImageData}> = ({children, level, image}) => {
  const props = {
    css: css`
      display: inline-flex;
      width: 100%;
      margin: 2rem 0 0;
      align-items: inline;
      color: ${colors.brand};
    `,
    children: <>{image && <><Image src={image} layout="fixed" height="30" width="30" />&nbsp;</>}{children}</>
  }
  switch (level) {
    case 1:
      return <h1 {...props} />
    case 2:
      return <h2 {...props} />
    case 3:
      return <h3 {...props} />
  }
}

const Column: React.FC<{span?: 1 | 2 | 3 | 4}> = ({children}) => (
  <div
    css={css`
      display: inline-block;
      width: 100%;
      max-width: 450px;
      margin: 0 auto;`}
    >
      {children}
    </div>
  )

const A: React.FC<{href: string; targetBlank?: true}> = ({children, href, targetBlank}) => (
  <a
    css={css`
      position: relative;
      color: ${colors.brand};
      text-decoration: none;

      &:hover {
        background-color: ${colors.brand};
        color: white;
      }
    `}
    href={href}
    {...(targetBlank ? {
      target: "_blank",
      rel: "noreferrer noopener"
    } : {})}
  >{children}</a>
)

const Section: React.FC<{title?: string}> = ({children, title}) => {
  return (
    <section
      css={css`
        max-width: 500px;
        margin: 0 auto;
        padding: 25px;

        @media (min-width: 1000px) {
          max-width: 1000px;
          column-count: 2;
        }

        @media (min-width: 1500px) {
          max-width: 1500px;
          column-count: 3;
        }

        @media (min-width: 2000px) {
          max-width: 2000px;
          column-count: 4;
        }
      `}
    >
      {title && <Column span={4}><Title level={2}>{title}</Title></Column>}
      {children}
    </section>
  )
}


export default function Home() {
  const heading = "Svataba Aničky a Domínka"
  return (
    <div>
      <Head>
        <title>{heading}</title>
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="manifest" href="/icons/site.webmanifest" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#fff" />
        <meta name="msapplication-TileColor" content="#fff" />
        <meta name="theme-color" content={colors.brand}></meta>
        <link href="https://fonts.googleapis.com/css2?family=Bitter:wght@400;600&display=swap" rel="stylesheed" />
      </Head>

      <Global
        styles={css`
          body {
            font-size: 18px;
            font-family: "Bitter";
            margin: 0;
          }
        `}
      />

      <main>
        <Section>
          <Column span={1}>
            <Picture css={css`max-width: 100%;`} src={srcOznameni} alt="Kostel" />
            <p>Máme se rádi a proto se budeme brát. Jestli nás máte také rádi, přijďte nám fandit.</p>
            <p>Oddá nás bratr farář a kamárd Ondřej Zikmund v malém tolerančním kostele z konce 18. století</p>
          </Column>
          <Column>
            <Title level={2} image={strom1}>Dostanete se k nám&hellip;</Title>
            <p>&hellip;po svých, na kole, či na koni. Jste-li z daleka, nevěste hlavu. 50 metrů od kostela je autobusová zastávka <A href="https://mapy.cz/s/damevemuke" targetBlank>Libiš, obec</A>, kam jezdí <A href="https://idos.idnes.cz/vlakyautobusymhdvse/spojeni/?byarr=true&t=Libi%C5%A1,,obec&date=4.9.2021&time=10:30" targetBlank>každou hodinu přímý autobus z Prahy</A>. A na zastávku <A href="https://mapy.cz/s/padubabeju" targetBlank>Libiš</A>, která je od kostela vzdálená 350 metrů, jezdí <A href="https://idos.idnes.cz/vlakyautobusymhdvse/spojeni/?byarr=true&t=Libi%C5%A1&date=4.9.2021&time=10:30" targetBlank>každou půl hodinu</A>. Máte-li raději vlaky, budete to mít s dvoukilometrovou procházkou z Neratovic. Projdete si tak trasu, kterou chodil Dominik s rodiči, když byl malým chlapcem, každou neděli. Doporučuji, ale jít <A href="https://mapy.cz/s/bevonafuse" targetBlank>delší a hezčí tříkilometrovou trasou</A>. Jak snad víte, autům příliš neholdujeme a neradi bychom, aby naše svatba způsobila dopravní kalamitu v ulici před kostelem. Jeli to však jediná možnost, a my chápeme, že to je občas nevyhnutelné, zaparkovat by mělo být možné v okolních ulicích. Helikoptéry mohou přistávat na nedalekém fotbalovém hřišti.</p>

            {/* <a href="https://mapy.cz/s/hufukelenu" target="_blank" rel="noreferrer">
              <Picture css={css`max-height: 100%`} src={scrMapa} onHoverSrc={srcMapa2} alt="Mapa" />
            </a> */}
          </Column>
          <Column>
            <Title level={2} image={strom2}>Co nám dát...</Title>
            <p>&hellip;nic a nebo něco. Je to klišé, ale největším darem pro nás bude, když přijedete a budete tam s námi. A pokud se vám nechce přijet s prázdnou, tak nám pomozte se svatební hostinou. Ale klidně přijeďte s prázdnou. Speciální dary, ani peníze nepotřebujeme. Žijeme celkem nenákladný život, tučně dotovaný jedním nadnárodním korporátem, hypotéku neplánujeme a vrtačku i mixér už máme. Pokud vás ale pálí peníze v kapse a chcete nám udělat radost, tak přispějte na některou z našich oblíbených charitativních organizací a napište nám o tom do svatební knihy, nebo nám tam na památku vlepte potvrzení.</p>
            <ul>
              <li><strong><A href="https://www.dobryandel.cz/jak-pomahat/#tabs-1-3" targetBlank>Dobrý anděl</A></strong> pomáhá rodinám nemocných dětí.</li>
              <li>Můžete podpořit <strong><A href="https://klublinkyvbezpeci.cz/podporte-nas/halo" targetBlank>Linku bezpečí</A></strong>, která se snaží pomáhat dětem dětem, které něco trápí.</li>
              <li><strong><A href="http://www.fod.cz/nase-cinnost/klokanek" targetBlank>Fond ohrožených dětí – Klokánek</A></strong> se snaží zajistit dětem domov na přechodnou dobu.</li>
              <li><strong><A href="https://www.darujme.cz/projekt/1204009" targetBlank>Samoživitelé či samoživitelky</A></strong> to mají těžké i když zrovna není pandemie. Můžete jim přispět tady: .</li>
              <li>Fanoušci zvířat můžou přispět organizaci <strong><A href="https://www.darujme.cz/projekt/853" targetBlank>Psí život</A></strong>, která se věnuje pomoci zvířatům lidí bez domova.</li>
              <li><strong><A href="https://www.darujme.cz/projekt/1201840" targetBlank>Potravinové banky</A></strong> se snaží dostat potraviny k těm, kteří to potřebují.</li>
              <li><strong><A href="https://www.darujme.cz/projekt/876" targetBlank>Paměť národa</A></strong> dokumentuje historii a snaží se, abychom na ni nezapomněli.</li>
            </ul>
          </Column>
          <Column>
            <Title level={2} image={strom3}>Na sebe si vezměte&hellip;</Title>
            <p>&hellip;něco. Prosím. Cokoli.</p>
            <p>Chcete-li však zapadnout do svatební vřavy, oblečte si šaty, či oblek. Necete-li do zmiňované vřavy zapadnout, oblečte si co chcete.</p>
          </Column>
          <Column>
            <Title level={2} image={strom1}>A kdybyste měmli hlad&hellip;</Title>
            <p>&hellip;tak jste si asi spletli svatbu. Na té naší se můžete po hned po bohoslužbě těšit na pořádný oběd na zahradě přímo u kostela, následovaný stoly prohýbajícími se pod tíhou nejrůznějšího jídla a pití.</p>
            <p>Budeme moc rádi, pokud na odpolední raut přispějete něčím drobným, nebo i méně drobným, co uvaříte, upečete nebo natrháte doma. Může to být cokoli – sladké, slané, jídlo, pití&hellip; Když do formuláře s účastí vyplníte, co byste mohli na raut připravit, ozve se vám Eliška a domluví se s vámi.</p>
            <p>A protože chceme mít na svatbě víc jídla, než odpadků, nenajdete na ní jednorázové nádobí a vícerázového bude pomálu. Přivezte si tedy vlastní jídelní náčiní. Doporučujeme misku, sklenici a příbory. Určitě si sbalte i krabičku a láhev na svačinu na cestu.</p>
          </Column>
          <Column>
            TODO
            <Title level={2}>S sebou</Title>
            <p> Vlastní jídelní servis (sklenici, talíř či misku a příbor)
            Krabičku a lahev na svačinu na cestu
            Věci na spaní (spacák, karimatku, případně stan)
            Hudebni nastroje</p>
          </Column>
          <Column span={2}>
            <Title level={2} image={strom1}>Program</Title>
            <table>
              <tbody>
                {plan.map((item, index) => (
                  <tr key={index}>
                    <td css={css`vertical-align: baseline; padding-right: 0.2rem;`}>{numberToTime(item.startTime)}</td>
                    <td css={css`padding-bottom: 0.6rem;`}>
                      <strong>{item.title}</strong>
                      <br />{item.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Column>
          <Column span={3}>
            <Title level={2} image={strom4}>Dejte nám vědět&hellip;</Title>
            <ParticipantForm />
          </Column>
        </Section>
      </main>
    </div>
  )
}
