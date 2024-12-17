import { apiClient } from '@/lib/apiClient'

export interface UserSchedule {
  name: string
  phoneNumber: string
  email: string
}

export const fetchContacts = async (): Promise<UserSchedule[]> => {
  const response = await apiClient.get('Contacts').json<UserSchedule[]>()
  return response
}

export interface createScheduleArgs {
  name: string
  phoneNumber: string
  email: string
}

export const createScheduleEvent = async ({ email, name, phoneNumber }: createScheduleArgs) => {
  const response = await apiClient.post('Contacts', {
    json: { name, phoneNumber, email },
  })
  return response.json()
}