import { apiClient } from '@/lib/apiClient'

export interface UserSchedule {
  name: string
  phoneNumber: string
  email: string
  id: string
}

export const fetchContacts = async (search?: string): Promise<UserSchedule[]> => {
  const response = await apiClient
    .get('Contacts', {
      searchParams: search ? { search } : undefined,
    })
    .json<UserSchedule[]>()

  return response
}

export async function fetchContactById(id: string): Promise<UserSchedule | undefined> {
  const response = await apiClient.get(`Contacts/${id}`).json<UserSchedule>()
  return response
}

export const updateContact = async (id: string, data: any) => {
  const response = await apiClient.put(`Contacts/${id}`, { json: data })
  if (response.ok && response.status !== 204) {
    return response.json()
  }
  return
}

export const deleteContact = async (id: string) => {
  await apiClient.delete(`Contacts/${id}`)
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
