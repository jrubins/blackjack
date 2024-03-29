import { InputHTMLAttributes } from 'react'
import _ from 'lodash'

const Input = ({
  onChange,
  value,
  ...rest
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  onChange: (value: string) => void
}): JSX.Element => {
  return (
    <input
      {...rest}
      className="w-full h-10 px-4 border border-light-grey rounded bg-transparent text-primary"
      onChange={(event) => onChange(event.target.value)}
      readOnly={!!(value && !onChange)}
      value={_.isNil(value) ? '' : value}
    />
  )
}

export default Input
