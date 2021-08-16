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
import ReactTooltip from 'react-tooltip'


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

const A: React.FC<{href: string; targetBlank?: true}> = ({children, href, targetBlank}) => (
  <a
    css={css`
      position: relative;
      color: ${colors.brand};
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    `}
    href={href}
    {...(targetBlank ? {
      target: "_blank",
      rel: "noreferrer noopener"
    } : {})}
  >{children}</a>
)

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

  },
  {
    title: "Gratulace a focení",
  },
  {
    title: "Oběd",
    description: "Pro svatebčany bude na kostelní zahradě připravený guláš, boršč a nějký ten salát aby nehladověli zatím co se rodina bude cpát na faře svíčkovou.",
  },
  {
    startTime: 15,
    title: "Zakrojení dortu a zahájení zahradní slavnosti"
  },
  {
    title: "Koncert v kostele",
    description: "Marie Bláhová (v té době již Aniččina tchýně) a Radka Dimitrovová."
  },
  {
    title: <A href="https://www.facebook.com/jinymetro/" targetBlank>Jiný metro</A>
  },
  {
    title: "Zakrojení divočáka"
  },
  {
    startTime: 20,
    title: "Tancování a tak",
    description: <>Zahraje nám <A href="https://harmonikar.net/" targetBlank>harmonikář Jindra Kelíšek s kapelou</A>.</>
  },
  {
    startTime: 22,
    title: "Ještě volnější zábava"
  },
  {
    startTime: 9.5,
    title: "Nedělní bohoslužba"
  },
  {
    title: "Velký úklid",
    description: "Budeme rádi za vaší pomoc."
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
      max-width: 430px;
      margin: 0 auto;`}
    >
      {children}
    </div>
  )

const Section: React.FC<{title?: string}> = ({children, title}) => {
  return (
    <section
      css={css`
        max-width: 460px;
        margin: 0 auto;
        padding: 15px;

        @media (min-width: 920px) {
          max-width: 920px;
          column-count: 2;
        }

        @media (min-width: 1380px) {
          max-width: 1380px;
          column-count: 3;
        }
      `}
    >
      {title && <Column span={4}><Title level={2}>{title}</Title></Column>}
      {children}
    </section>
  )
}

export const Tooltip: React.FC<{tip: string}> = ({tip, children}) => <span data-for="main" data-tip={tip} data-iscapture="true">{children}</span>

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
        <meta name="robots" content="noindex" />
        <meta name="og:description" content="Máme se rádi a proto se budeme brát. Jestli nás máte také rádi, přijďte nám fandit." />
      </Head>

      <Global
        styles={css`
          body {
            font-size: 18px;
            font-family: "Bitter";
            margin: 0;
          }

          @keyframes rotating {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      />

      <main>
        <Section>
          <Column span={1}>
            <Picture css={css`max-width: 100%;`} src={srcOznameni} alt="Kostel" />
            <p>Máme se rádi a proto se budeme brát. Jestli nás máte také rádi, přijďte nám fandit.</p>
            <p>Oddá nás bratr farář a kamárd Ondřej Zikmund v <A href="https://mapy.cz/s/jafosomeso" targetBlank>malém evangelickém tolerančním kostele</A>  z konce 18. století, který leží na dohled od chaldících věží neratovické chemičky v přilehlé obci Libiš.</p>
          </Column>
          <Column>
            <Title level={2} image={strom1}>Dostanete se k nám&hellip;</Title>
            <p>&hellip;po svých, na kole, či na koni. Jste-li z daleka, nevěste hlavu. 50 metrů od kostela je autobusová zastávka <A href="https://mapy.cz/s/damevemuke" targetBlank>Libiš, obec</A>, kam jezdí <A href="https://idos.idnes.cz/vlakyautobusymhdvse/spojeni/?byarr=true&t=Libi%C5%A1,,obec&date=4.9.2021&time=10:30" targetBlank>každou hodinu přímý autobus z Prahy</A>. A na zastávku <A href="https://mapy.cz/s/padubabeju" targetBlank>Libiš</A>, která je od kostela vzdálená 350 metrů, jezdí <A href="https://idos.idnes.cz/vlakyautobusymhdvse/spojeni/?byarr=true&t=Libi%C5%A1&date=4.9.2021&time=10:30" targetBlank>každou půl hodinu</A>. Máte-li raději vlaky, budete to mít s dvoukilometrovou procházkou z Neratovic. Projdete si tak trasu, kterou chodil Dominik s rodiči, když byl malým chlapcem, každou neděli. Doporučuji, ale jít <A href="https://mapy.cz/s/bevonafuse" targetBlank>delší a hezčí tříkilometrovou trasou</A>. Jak snad víte, autům příliš neholdujeme a neradi bychom, aby naše svatba způsobila dopravní kalamitu v ulici před kostelem. Jeli to však jediná možnost, a my chápeme, že to je občas nevyhnutelné, zaparkovat by mělo být možné v okolních ulicích. Helikoptéry mohou přistávat na nedalekém fotbalovém hřišti.</p>
          </Column>
          <Column>
            <Title level={2} image={strom3}>Na sebe si vezměte&hellip;</Title>
            <p>&hellip;něco. Prosím. Cokoli.</p>
            <p>Chcete-li však zapadnout do svatební vřavy, oblečte si šaty, či oblek. Necete-li do zmiňované vřavy zapadnout, oblečte si co chcete. Odpolední zahradní slavnost bude probíhat&hellip; &hellip; na zahradě. Asi to nebude na vysoké podpadky.</p>
          </Column>
          <Column>
            <Title level={2} image={strom1}>A kdybyste měli hlad&hellip;</Title>
            <p>&hellip;tak jste si asi spletli svatbu. Na té naší se můžete hned po bohoslužbě těšit na pořádný oběd na zahradě přímo u kostela na stoly prohýbající se pod tíhou jídla a pití.</p>
            <p>Budeme moc rádi, pokud na odpolední raut přispějete něčím drobným, nebo i méně drobným, co uvaříte, upečete nebo natrháte doma. Může to být cokoli – sladké, slané, jídlo, pití&hellip; Když do formuláře s účastí vyplníte, co byste mohli na raut připravit, ozve se vám Eliška a domluví se s vámi.</p>
            <p>A protože chceme mít na svatbě víc jídla, než odpadků, nenajdete na ní jednorázové nádobí a vícerázového bude pomálu. Přivezte si tedy vlastní jídelní náčiní. Doporučujeme misku, sklenici a příbory. Určitě si sbalte i krabičku a láhev na svačinu na cestu.</p>
          </Column>
          <Column>
            <Title level={2} image={strom2}>Dejte nám...</Title>
            <p>&hellip;nic a nebo něco. Je to klišé, ale největším darem pro nás bude, když přijedete a budete tam s námi. A pokud se vám nechce přijet s prázdnou, tak nám pomozte se svatební hostinou. Ale klidně přijeďte s prázdnou. Speciální dary, ani peníze nepotřebujeme. Žijeme celkem nenákladný život, tučně dotovaný <Tooltip tip="🥕">nadnárodním korporátem</Tooltip>, hypotéku neplánujeme a vrtačku i mixér už máme. Pokud vás ale pálí peníze v kapse a chcete nám udělat radost, tak přispějte na některou z našich oblíbených charitativních organizací a napište nám o tom do svatební knihy, nebo nám tam na památku vlepte nějaký doklad.</p>
            <p>Tady je pár tipů:</p>
            <ul>
              <li><strong><A href="https://www.dobryandel.cz/jak-pomahat/#tabs-1-3" targetBlank>Dobrý anděl</A></strong> pomáhá rodinám nemocných dětí.</li>
              <li>Můžete podpořit <strong><A href="https://klublinkyvbezpeci.cz/podporte-nas/halo" targetBlank>Linku bezpečí</A></strong>, která se snaží pomáhat dětem, které něco trápí.</li>
              <li><strong><A href="http://www.fod.cz/nase-cinnost/klokanek" targetBlank>Fond ohrožených dětí – Klokánek</A></strong> se snaží zajistit dětem domov na přechodnou dobu.</li>
              <li><strong><A href="https://www.darujme.cz/projekt/1204009" targetBlank>Samoživitelé či samoživitelky</A></strong> to mají těžké i když zrovna není pandemie.</li>
              <li>Fanoušci zvířat můžou přispět organizaci <strong><A href="https://www.darujme.cz/projekt/853" targetBlank>Psí život</A></strong>, která se věnuje pomoci zvířatům lidí bez domova.</li>
              <li><strong><A href="https://www.darujme.cz/projekt/1201840" targetBlank>Potravinové banky</A></strong> se snaží dostat potraviny k těm, kteří to potřebují.</li>
              <li><strong><A href="https://www.darujme.cz/projekt/876" targetBlank>Paměť národa</A></strong> dokumentuje historii a snaží se, abychom na ni nezapomněli.</li>
            </ul>
          </Column>
          <Column>
            <Title level={2}>Spát budete moct&hellip;</Title>
            <p>&hellip;v pižamu, noční košili, či spodním prádle. Fara má střechu a pod ní podlahu, kam si můžete položit karimatku a spacák. Fara má i zahradu, kde si můžete postavit stan, bivak či se jen opřít o strom a posunout si do čela své sombréro.</p>
            <p>Budeme rádi, když s námi v Libiši strávíte noc a ještě radši, když nám druhý den pomůžete s úklidem.</p>
          </Column>
          <Column>
            <Title level={2}>S sebou si přivezte&hellip;</Title>
            <ul>
              <li>vlastní jídelní servis (sklenici, talíř či misku a příbor),</li>
              <li>krabičku a lahev na svačinu na cestu,</li>
              <li>věci na spaní (spacák, karimatku, případně stan),</li>
              <li>hudebni nástroje.</li>
            </ul>
          </Column>
          <Column span={2}>
            <Title level={2} image={strom1}>Takhle jsme to naplánovali&hellip;</Title>
            <p>&hellip;ale víte jak&hellip;</p>
            <table>
              <tbody>
                {plan.map((item, index) => (
                  <tr key={index}>
                    <td css={css`vertical-align: baseline; padding-right: 0.2rem; text-align: right;`}>{item.startTime ? numberToTime(item.startTime) : ""}</td>
                    <td css={css`padding-bottom: 0.6rem;`}>
                      <strong>{item.title}</strong>
                      <br />{item.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>Chcete-li také něčím vykutálným přispět do programu, <A href="mailto:nik@skaut.cz" targetBlank>napište ženichovy</A>.</p>
          </Column>
          <Column span={3}>
            <Title level={2} image={strom4}>Dejte nám vědět&hellip;</Title>
            <ParticipantForm />
          </Column>
        </Section>
      </main>
      <ReactTooltip id="main" />
    </div>
  )
}
