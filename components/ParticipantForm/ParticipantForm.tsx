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
  name: string;
  label?: ReactNode;
  type?: "text" | "number" | "radio" | "checkbox"
  min?: number
  max?: number
}

interface Option {
  label: string;
  value: string | number | boolean;
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
          <label
            htmlFor={`${props.name}-${value}`}
            css={css`
              display: inline-flex;
              align-items: center;

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

              input:checked + &:before {
                background-image: url("/tecka.jpg");
              }
            `}
          >
            {label}
          </label>
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
        {props.values?.count === "more" && <TextInput label="Kolik vás bude?" name="familyCount" type="number" min={2} />}
        <OptionsInput
          label="S hostinou nám"
          name="helpWithFood"
          type="radio"
          options={[
            {
              label: "můžeš pomoct",
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
            label="Co můžeš připravit?"
            name="kindOfFood"
            options={[
              {
                label: "Salát",
                value: KindOfFood.Salad
              },
              {
                label: "Pomazánku",
                value: KindOfFood.Spread
              },
              {
                label: "Svatební koláčky",
                value: KindOfFood.Cakes
              },
              {
                label: "Upeču něco sladkého",
                value: KindOfFood.SweetBaking
              },
              {
                label: "Upeču něco slaného",
                value: KindOfFood.SaldBaking
              },
              {
                label: "Nasmažím řízky",
                value: KindOfFood.Steaks
              },
              {
                label: "Něco jiného",
                value: KindOfFood.Others
              }
            ]}
          />
        )}
        {props.values?.helpWithFood === "yes" && props.values?.kindOfFood?.find(item => item === KindOfFood.Others) && <TextInput label="Co?" name="kindOfFoodSpec" />}
        <OptionsInput
          label="Kdy přijedeš?"
          name="arrival"
          type="radio"
          options={[
            {
              label: "V pátek večer",
              value: Arrival.Friday
            },
            {
              label: "V sobotu dopoledne",
              value: Arrival.Sunday
            }
          ]}
        />
        <OptionsInput
          label="Kdy odjedeš?"
          name="departure"
          type="radio"
          options={[
            {
              label: "Hned po obřadu",
              value: Departure.SaturdayAm
            },
            {
              label: "V sobotu odpoledne či večer",
              value: Departure.SaturdayPm
            },
            {
              label: "Až v neděli",
              value: Departure.Sunday
            },
          ]}
        />
        <TextAreaInput label={<>Ještě něco nám napiš&hellip;</>} name="note" />
        <button type="submit">Odeslat</button>
      </Form>
    )}
  </Formik>
)