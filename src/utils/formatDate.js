export const formatDate = (dateTime) => {
  if (!dateTime) {
    return ''
  }

  const date = new Date(dateTime)

  return new Intl.DateTimeFormat('en', {
    weekday: 'short',
    day: '2-digit',
    month: 'short'
  }).format(date)
}
