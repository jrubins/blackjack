import numeral from 'numeral'

/**
 * Formats the provided value into a string representing the value as a currency with commas.
 */
export function formatCurrency(value: number): string {
  return numeral(value).format('$0,0')
}

/**
 * Formats the provided value into a string abbreviated with 'k' representing thousands.
 */
export function formatThousands(value: number): string {
  return numeral(value).format('0[.]00a')
}
