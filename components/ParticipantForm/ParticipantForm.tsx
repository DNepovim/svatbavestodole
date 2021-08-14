/** @jsxImportSource @emotion/react */
import React, { ReactNode } from "react"
import * as yup from 'yup'
import { Formik, Form, Field, FormikHelpers, ErrorMessage } from "formik"
import { css } from "@emotion/react"
import { colors } from "../../pages"

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
  SaturdayPm = " v sobotu odpoledne",
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
  email: yup.string().email("E-mail není vyplněn správně.").required("Vyplň svůj e-mail."),
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
      margin: 0 0 1rem;
    `}
  >
    {children}
  </fieldset>
)

interface FieldProps {
  name: string
  label?: ReactNode
  type?: "text" | "number" | "radio" | "checkbox"
  min?: number
  max?: number
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
      height: 1rem
    `}
  >
    <ErrorMessage
      name={name}
    />
  </div>
)

export const TextInput: React.FC<FieldProps> = ({ label, name }) =>  (
  <Fieldset>
    {label && <Label name={name}>{label}</Label>}
    <Field
      css={css`
        color: ${colors.brand};
        font-size: 1.2rem;
        padding: 0.4rem 0 0.1rem;
        border: none;
        border-image: url(/cara.jpg) 30 round;
        border-bottom: 5px solid transparent;
        border-right: 5px solid transparent;
        transition: background-color 300ms;

        &:focus {
          outline: none;
          background-color: ${colors.light};
        }
      `}
      name={name}
    />
    <FieldError name={name} />
  </Fieldset>
)

export const TextAreaInput: React.FC<FieldProps> = ({ label, name }) => {
  return (
    <Fieldset>
      {label && <Label name={name}>{label}</Label>}
      <Field as="textarea" name={name} />
      <FieldError name={name} />
    </Fieldset>
  )
}

const OptionsInput: React.FC<FieldProps & { options: Option[] }> = ({label, options, ...props }) => {
  const type = props.type ?? "checkbox"
  return (
    <Fieldset>
      {label && <Label name={props.name}>{label}</Label>}
      {options.map(({label, value}) => (
        <React.Fragment key={`${props.name}-${value}`}>
          <Field id={`${props.name}-${value}`} css={css`display: none`} type={type} name={props.name} value={value} />
          <div>
            <label
              htmlFor={`${props.name}-${value}`}
              css={css`
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

const SubmitButton:React.FC = ({children}) => (
  <button
    css={css`
      background-color: white
    `}
    type="submit"
  >
    {children}
  </button>
)

const isAlone = (count?: Count): boolean => !count || count === Count.one

export const ParticipantForm: React.FC = () => (
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
      note: undefined
    }}
    validationSchema={schema}
    onSubmit={async (values: Partial<ParticipantToRegister>, { setSubmitting }: FormikHelpers<Partial<ParticipantToRegister>>) => {
      await fetch("/api/addParticipant", { method: "POST", body: JSON.stringify(values) })
      setSubmitting(false)
    }}
  >
    {props => (
      <Form css={css`max-width: 300px`}>
        <TextInput label={<>...jaké je tvé <strong>jméno</strong>,</>} name="firstName" />
        <TextInput label={<><strong>příjmení</strong>,</>} name="surName" />
        <TextInput label={<>a <strong>e-mail</strong>.</>} name="email" />
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
        />
        {props.values?.count === "more" && <TextInput label="No a kolik vás teda bude?" name="familyCount" type="number" min={2} />}
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
          />
        )}
        {props.values?.helpWithFood === "yes" && props.values?.kindOfFood?.find(item => item === KindOfFood.Others) && <TextInput label="A jakou pak?" name="kindOfFoodSpec" />}
        <OptionsInput
          label={<>Dá by nás zajímalo, jestli {isAlone(props.values.count) ? "přijedeš" : "príjedete"}</>}
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
        />
        <TextAreaInput label={<>Ještě něco nám {isAlone(props.values.count) ? "napiš" : "napište"}&hellip;</>} name="note" />
        <button type="submit">Odeslat</button>
      </Form>
    )}
  </Formik>
)