/** @jsxImportSource @emotion/react */
import React, { ReactNode } from "react"
import * as yup from 'yup'
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik"
import { css } from "@emotion/react"
import { colors } from "../../pages"
import strom4 from '../../images/strom4.jpg'
import Image from 'next/image'
import { useAlert } from 'react-alert'
import { analytics } from "../../utils/analytics"

enum KindOfFood {
  Salad = "salát",
  Spread = "pomazánka",
  Cakes = "koláčky",
  SweetBaking = "sladké pečení",
  SaldBaking = "slané pečení",
  Steaks = "řízky",
  Others = "other"
}

enum Arrival {
  Friday = "pátek",
  Sunday = "sobota"
}

enum Departure {
  SaturdayAm = "v sobotu po obřadu",
  SaturdayPm = "v sobotu odpoledne",
  Sunday = "v neděli"
}

export enum Count {
  one = "1",
  two = "2",
  more = "more"
}

export interface ParticipantToRegister {
  firstName: string
  surName: string
  email: string
  count: Count
  familyCount?: number
  helpWithFood: "yes" | "no"
  kindOfFood?: KindOfFood[]
  kindOfFoodSpec?: string
  arrival: Arrival
  departure: Departure
  note?: string
}

const schema = yup.object().shape({
  firstName: yup.string().required("Vyplň své jméno."),
  surName: yup.string().required("Vyplň své příjmení."),
  email: yup.string().trim().email("E-mail není vyplněn správně.").required("Vyplň svůj e-mail."),
  count: yup.string().required("Vyplň kolik vás přijede."),
  familyCount: yup.mixed().when(["count"], {
    is: "more",
    then: yup.number().required("Vyplň kolik vás přijede.")
  }),
  helpWithFood: yup.mixed().oneOf(["yes", "no"]).required("Zaškrtni, jestli nám pomůžeš s jídlem."),
  kindOfFood: yup.mixed().when(["helpWithFood"], {
    is: "yes",
    then: yup.array().of(yup.string()).required("Vyber s jakým jídlem nám chceš pomoct.")
  }),
  kindOfFoodSpec: yup.string().when(["kindOfFood"], {
    is: (kindOfFood: KindOfFood) => kindOfFood === KindOfFood.Others,
    then: yup.string().required("Napiš jaké jídlo můžeš přivézt.")
  }),
  arrival: yup.string().required("Vyber kdy přijedeš."),
  departure: yup.string().required("Vyber kdy odjedeš."),
  note: yup.string()
})

const Fieldset: React.FC = ({children}) => (
  <fieldset
    css={css`
      display: inline-flex;
      width: 100%;
      flex-flow: column;
      border: none;
      padding: 0;
      margin: 0;
    `}
  >
    {children}
  </fieldset>
)

interface FieldProps {
  name: string
  label?: ReactNode
  type?: "text" | "number" | "radio" | "checkbox" | "textarea"
  min?: number
  max?: number
  disabled?: boolean
}

interface Option {
  label: ReactNode
  value: string | number | boolean
}

const Label: React.FC<{name: string}> = ({name, children}) => (<label htmlFor={name}>{children}</label>)

const FieldError: React.FC<{name: string}> = ({name}) => (
  <div
    css={css`
      color: red;
      font-size: 0.8rem;
      height: 1.2rem;
    `}
  >
    <ErrorMessage
      name={name}
    />
  </div>
)

export const TextInput: React.FC<FieldProps> = ({ label, name, type, disabled}) =>  (
  <Fieldset>
    {label && <Label name={name}>{label}</Label>}
    <Field
      id={name}
      as={type}
      css={css`
        color: ${colors.brand};
        font-size: 1.2rem;
        padding: 0.4rem 0.6rem;
        border-image: url(/frame.png) 20 round;
        border-width: 7px;
        transition: background-color 300ms;
        width: 100%;
        box-sizing: border-box;

        &:focus {
          outline: none;
          background-color: ${colors.light};
        }
      `}
      name={name}
      disabled={disabled}
    />
    <FieldError name={name} />
  </Fieldset>
)

const OptionsInput: React.FC<FieldProps & { options: Option[] }> = ({label, options, disabled, ...props }) => {
  const type = props.type ?? "checkbox"
  return (
    <Fieldset>
      {label && <Label name={props.name}>{label}</Label>}
      {options.map(({label, value}) => (
        <React.Fragment key={`${props.name}-${value}`}>
          <Field id={`${props.name}-${value}`} css={css`display: none`} type={type} name={props.name} value={value} disabled={disabled} />
          <div>
            <label
              htmlFor={`${props.name}-${value}`}
              css={css`
                cursor: pointer;
                &:before {
                  content: "";
                  display: inline-block;
                  background-image: url("/teckaNeg.jpg");
                  background-size: contain;
                  background-position: center / center;
                  background-repeat: no-repeat;
                  width: 1.2rem;
                  height: 1.2rem;
                }

                input:checked + div &:before {
                  background-image: url("/tecka.jpg");
                }
              `}
            >
              {label}
            </label>
          </div>
        </React.Fragment>
      ))}
      <FieldError name={props.name} />
    </Fieldset>
  )
}

const SubmitButton:React.FC<{isSubmiting?: boolean}> = ({children, isSubmiting}) => (
  <button
    css={css`
      display: flex;
      align-items: center;
      font-family: "Bitter";
      background-color: white;
      color: ${colors.brand};
      font-size: 1.2rem;
      padding: 0rem 0.9rem 0 0.3rem;
      border-image: url(/frame.png) 20 round;
      border-width: 7px;
      cursor: pointer;

      img {
        transform: rotate(0);
        transition: transform 300ms;
        ${isSubmiting ? "animation: rotating 2s linear infinite;" : ""}

      }

      &:hover img {
        transform: rotate(360deg)
      }
    `}
    type="submit"
    disabled={isSubmiting}
  >
    <Image src={strom4} layout="fixed" height="20" width="20" alt=""/>
    &nbsp;{children}
  </button>
)

const isAlone = (count?: Count): boolean => !count || count === Count.one

function isString(x: any): x is string {
  return typeof x === "string";
}

export const ParticipantForm: React.FC = () => {
  const alert = useAlert()
  return (
    <Formik<Partial<ParticipantToRegister>>
      initialValues={{
        firstName: "",
        surName: "",
        email: "",
        count: undefined,
        familyCount: undefined,
        helpWithFood: undefined,
        kindOfFood: undefined,
        kindOfFoodSpec: undefined,
        arrival: undefined,
        departure: undefined,
        note: ""
      }}
      validationSchema={schema}
      onSubmit={async (values: Partial<ParticipantToRegister>, formikHelpers: FormikHelpers<Partial<ParticipantToRegister>>) => {
        const sanitizedValues = Object.entries(values).reduce((acc, [key, value]) => ({...acc, [key]: isString(value) ? value.trim() : value }),{})
        const res = await fetch("/api/addParticipant", { method: "POST", body: JSON.stringify(values) })
        analytics.track('formSubmited', values)
        if (res.status === 200) {
          alert.success(`Hotovo. Těšíme se na ${values.count === Count.one ? "tebe" : "vás"}.`)
          formikHelpers.resetForm()
        } else {
          alert.error('Něco se nepovedlo. Zkus to ještě jednou, nebo nám napiš.')
        }
      }}
    >
      {props => (
        <Form css={css`max-width: 300px`}>
          <TextInput label={<>...jaké je tvé <strong>jméno</strong>,</>} name="firstName" disabled={props.isSubmitting} />
          <TextInput label={<><strong>příjmení</strong>,</>} name="surName"  disabled={props.isSubmitting}/>
          <TextInput label={<>a <strong>e-mail</strong>.</>} name="email"  disabled={props.isSubmitting}/>
          <OptionsInput
            label="Přijedeš"
            name="count"
            type="radio"
            options={[
              {
                label: "sám,",
                value: Count.one
              },
              {
                label: "s partnerem,",
                value: Count.two
              },
              {
                label: "nebo s rodinou?",
                value: Count.more
              }
            ]}
            disabled={props.isSubmitting}
          />
          {props.values?.count === "more" && <TextInput label="No a kolik vás teda bude?" name="familyCount" disabled={props.isSubmitting} />}
          <OptionsInput
            label="S hostinou nám"
            name="helpWithFood"
            type="radio"
            options={[
              {
                label: `${isAlone(props.values.count) ? "můžeš" : "můžete"} pomoct`,
                value: "yes"
              },
              {
                label: "nebo ne?",
                value: "no"
              }
            ]}
            disabled={props.isSubmitting}
          />
          {props.values?.helpWithFood === "yes" && (
            <OptionsInput
              label={`A spíš se ${isAlone(props.values.count) ? "cítíš" : "cítíte"} na `}
              name="kindOfFood"
              options={[
                {
                  label: <><strong>salát</strong>,</>,
                  value: KindOfFood.Salad
                },
                {
                  label: <>nějakou <strong>pomazánku</strong>,</>,
                  value: KindOfFood.Spread
                },
                {
                  label: <>nebo snad <strong>svatební koláčky</strong>,</>,
                  value: KindOfFood.Cakes
                },
                {
                  label: <>a nebo {isAlone(props.values.count) ? "bys" : "byste"} <strong>{isAlone(props.values.count) ? "upekl" : "upekly"} něco sladkého</strong>,</>,
                  value: KindOfFood.SweetBaking
                },
                {
                  label: <>nebo <strong>slaného</strong>,</>,
                  value: KindOfFood.SaldBaking
                },
                {
                  label: <>nebo {isAlone(props.values.count) ? "nasmažíš" : "nasmažíte"} <strong>řízky</strong>?</>,
                  value: KindOfFood.Steaks
                },
                {
                  label: <> A nebo {isAlone(props.values.count) ? "umíš" : "umíte"} nějakou <strong>specialitu</strong>, která na svatbě nesmí chybět?</>,
                  value: KindOfFood.Others
                }
              ]}
              disabled={props.isSubmitting}
            />
          )}
          {props.values?.helpWithFood === "yes" && props.values?.kindOfFood?.find(item => item === KindOfFood.Others) && <TextInput label="A jakou pak?" name="kindOfFoodSpec" disabled={props.isSubmitting} />}
          <OptionsInput
            label={<>Dál by nás zajímalo, jestli {isAlone(props.values.count) ? "přijedeš" : "přijedete"}</>}
            name="arrival"
            type="radio"
            options={[
              {
                label: "v pátek večer,",
                value: Arrival.Friday
              },
              {
                label: "nebo až v sobotu před obřadem.",
                value: Arrival.Sunday
              }
            ]}
            disabled={props.isSubmitting}
          />
          <OptionsInput
            label={<>A taky jestli {isAlone(props.values.count) ? "plánuješ" : "plánujete"} odjet</>}
            name="departure"
            type="radio"
            options={[
              {
                label: "hned po obřadu,",
                value: Departure.SaturdayAm
              },
              {
                label: "v sobotu odpoledne či večer,",
                value: Departure.SaturdayPm
              },
              {
                label: `nebo ${isAlone(props.values.count) ? "budeš" : "budete"} přes noc.`,
                value: Departure.Sunday
              },
            ]}
            disabled={props.isSubmitting}
          />
          <TextInput type={"textarea"} label={<>Ještě něco nám {isAlone(props.values.count) ? "napiš" : "napište"}&hellip;</>} name="note" disabled={props.isSubmitting} />
          <SubmitButton isSubmiting={props.isSubmitting}>Odeslat</SubmitButton>
        </Form>
      )}
    </Formik>
  )
}