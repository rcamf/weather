import { throwError } from 'rxjs'

export const handleError = (error) => {
  if (error.error instanceof ErrorEvent) 
    return throwError(error.error.message)
  else 
    return throwError(error.error.message)
}