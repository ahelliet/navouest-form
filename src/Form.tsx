import { useForm, useFieldArray } from "react-hook-form";
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import Combox from "./components/Combox";
import { clients, drivers, warehouses, vehicles } from './mocks'

type Step = {
    startedAt: Date;
    endedAt: Date;
    from: string;
    to: string;
    passengersCount?: number;
    commentary?: string;
}

type FormValues = {
    steps?: Step[]
};

export default function App() {
    const [query, setQuery] = useState('')
    const [selectedClient, setSelectedClient]: [selectedClient: any, setSelectedClient: Dispatch<SetStateAction<undefined>>] = useState()

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<FormValues>({
        // defaultValues: {
        //     steps: [
        //         {
        //             startedAt: new Date(Date.now()),
        //             endedAt: new Date(Date.now()),
        //             from: undefined,
        //             to: undefined,
        //             commentary: undefined,
        //             passengersCount: undefined
        //         }]
        // },
        mode: "onBlur"
    });

    const { fields, append, remove } = useFieldArray({
        name: "steps",
        control
    });

    const onSubmit = async (data: FormValues) => {
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log(data);
    }

    const filteredClients =
        query === ''
            ? clients
            : clients.filter((client) =>
                client.name
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(query.toLowerCase().replace(/\s+/g, ''))
            )

    return (
        <div className="mt-12 container mx-auto">
            <h2 className="font-semibold text-teal-600 text-2xl">Créer un trajet</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col container mx-auto">
                <div className="flex flex-col container mx-auto border border-teal-600">
                    <div className="flex my-4 pl-4 items-center">
                        <Combobox value={selectedClient ?? {}} onChange={setSelectedClient}>
                            <div className="relative mt-0">
                                <div className="flex items-center gap-2">
                                    <Combobox.Label className={"flex text-sm items-center"}>Sélectionner un client :</Combobox.Label>
                                    <div className="relative cursor-default overflow-hidden bg-white text-left focus:outline-none shadow-sm focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-600 sm:text-sm flex items-center ring-1 ring-teal-600">
                                        <Combobox.Input
                                            placeholder="Sélectionner un client..."
                                            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                                            displayValue={(client: any) => client.name!}
                                            onChange={(event) => setQuery(event.target.value)}
                                        />
                                    </div>
                                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                        <ChevronUpDownIcon
                                            className="h-5 w-5 text-teal-800"
                                            aria-hidden="true"
                                        />
                                    </Combobox.Button>
                                </div>
                                <Transition
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                    afterLeave={() => setQuery('')}
                                >
                                    <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {filteredClients.length === 0 && query !== '' ? (
                                            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                                Nothing found.
                                            </div>
                                        ) : (
                                            filteredClients.map((client) => (
                                                <Combobox.Option
                                                    key={client.id}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-teal-600 text-white' : 'text-gray-900'
                                                        }`
                                                    }
                                                    value={client}
                                                >
                                                    {({ selected, active }) => (
                                                        <>
                                                            <span
                                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                                    }`}
                                                            >
                                                                {client.name}
                                                            </span>
                                                            {selected ? (
                                                                <span
                                                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'
                                                                        }`}
                                                                >
                                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </Combobox.Option>
                                            ))
                                        )}
                                    </Combobox.Options>
                                </Transition>
                            </div>
                        </Combobox>
                    </div>
                    <div className="container mx-auto flex flex-col border-teal-600 px-4">
                        <header className="flex bg-teal-600 h-10 items-center pl-4">
                            <h3 className="text-white">Étape(s) :</h3>
                        </header>
                        <main className="border-l-[1px] border-r-[1px] border-b-[1px] border-teal-600 py-4 space-y-4">
                            {fields.map((field, index) => {
                                return (
                                    <div key={field.id} className="mx-6 ring-1 ring-teal-600 border-t-8 border-teal-600">
                                        <section className="container mx-auto space-y-2 p-2" key={field.id}>

                                            <div className="flex justify-between">

                                                <div className="flex gap-x-4">
                                                    <input
                                                        type={'datetime-local'}
                                                        {...register(`steps.${index}.startedAt` as const, {
                                                            valueAsDate: true,
                                                            required: true
                                                        })}
                                                        className={`focus:ring-teal-600 focus:border-teal-600 ${errors?.steps?.[index]?.startedAt ? "error" : ""}`}
                                                    />

                                                    <input
                                                        type={'datetime-local'}
                                                        {...register(`steps.${index}.endedAt` as const, {
                                                            valueAsDate: true,
                                                            required: true
                                                        })}
                                                        className={`focus:ring-teal-600 focus:border-teal-600 ${errors?.steps?.[index]?.endedAt ? "error" : ""}`}
                                                    />

                                                    <input
                                                        placeholder="PAX"
                                                        min={0}
                                                        type="number"
                                                        {...register(`steps.${index}.passengersCount` as const, {
                                                            valueAsNumber: true,
                                                            required: false
                                                        })}
                                                        className={`max-w-[6rem] focus:ring-teal-600 focus:border-teal-600 ${errors?.steps?.[index]?.passengersCount ? "error" : ""}`}
                                                    />

                                                </div>

                                                <div className="flex items-center">

                                                    <button type="button" className="ring-1 ring-teal-600 p-2 shadow-md text-white bg-teal-600 hover:bg-teal-800 duration-150 " onClick={() => remove(index)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex gap-x-2">
                                                <div className="flex flex-col w-full">
                                                    <input
                                                        placeholder="Adresse de départ"
                                                        type="text"
                                                        {...register(`steps.${index}.from` as const, {
                                                            required: true
                                                        })}
                                                        className={`focus:ring-teal-600 focus:border-teal-600 ${errors?.steps?.[index]?.from ? "error" : ""} `}
                                                    />

                                                    <input
                                                        placeholder="Adresse d'arrivée"
                                                        type="text"
                                                        {...register(`steps.${index}.to` as const, {
                                                            required: true
                                                        })}
                                                        className={`focus:ring-teal-600 focus:border-teal-600 ${errors?.steps?.[index]?.from ? "error" : ""} `}
                                                    />
                                                </div>

                                                <textarea id="" rows={2} className="w-full focus:ring-teal-600 focus:border-teal-600"
                                                    placeholder="Notes..."
                                                    {...register(`steps.${index}.commentary` as const, {
                                                        required: false
                                                    })}
                                                ></textarea>
                                            </div>


                                            <table className="table-auto w-full">
                                                <thead>
                                                    <tr className="border border-teal-600 text-left text-teal-600">
                                                        <th className="pl-2 w-3/12">Véhicule</th>
                                                        <th className="w-3/12">Chauffeur</th>
                                                        <th className="w-3/12">Entrepôt</th>
                                                        <th className="w-1/12"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td><Combox placeholder={"Sélectionner un véhicule disponible"} data={vehicles} /></td>
                                                        <td><Combox placeholder={"Sélectionner un chauffeur disponible"} data={drivers} /></td>
                                                        <td><Combox placeholder={"Séléctionner l'entrepôt"} data={warehouses} /></td>
                                                        <td className="text-center"><button type="button" className="text-teal-600 hover:text-teal-800 duration-150">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                            </svg>

                                                        </button></td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </section>

                                    </div>
                                );
                            })}

                            <button
                                type="button"
                                className="ring-1 ring-teal-600 ml-6 px-4 py-1 shadow-md hover:bg-teal-600 hover:text-white duration-200"
                                onClick={() =>
                                    append({
                                        startedAt: new Date(Date.now()),
                                        endedAt: new Date(Date.now()),
                                        from: '',
                                        to: '',
                                        passengersCount: undefined,
                                        commentary: '',
                                    })
                                }
                            >
                                Ajouter une étape
                            </button>
                        </main>

                    </div>

                    <input type="submit"
                        className="ring-1 ring-teal-600 ml-auto mt-4 px-4 py-1 mb-4 mr-4 shadow-md bg-teal-600 text-white hover:bg-teal-800"
                        value={isSubmitting ? "en cours..." : "Sauvegarder"} />
                </div>

            </form>

        </div >
    );
}
