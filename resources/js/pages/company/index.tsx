import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import companyRoute from '@/routes/company';
import { type BreadcrumbItem } from '@/types';
import { Link, Head, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Companies',
        href: companyRoute.index().url,
    },
];

export default function CompanyIndex() {
    const { company_data } = usePage().props as any;
    const [companies, setCompanies] = useState(company_data.data || []);

    const toggleStatus = async (companyId: any) => {
        try {
            const response = await axios.patch(companyRoute.toggleStatus(companyId).url, {
                status: companies.find((c: any) => c.id === companyId)?.is_active ? 'in_active' : 'active'
            });
            
            const updatedStatus = response.data.data.is_active;

            setCompanies((prevCompanies: any) =>
                prevCompanies.map((company: any) =>
                    company.id === companyId ? { ...company, is_active: updatedStatus } : company
                )
            );

        } catch (error) {
            console.error('Failed to toggle company status', error);
            alert('Something went wrong while updating status.');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this company?')) return;

        try {
            await router.delete(companyRoute.destroy(id).url, {
                onSuccess: () => {
                    setCompanies((prev:any) => prev.filter((company:any) => company.id !== id));
                },
                onError: () => {
                    alert('Failed to delete company.');
                },
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Companies" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4">
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70">
                        <div className="p-4">
                            <div className='mb-4 flex justify-between'>
                                <h2 className="text-2xl font-semibold">Company List</h2>
                                <div className='col text-right'>
                                    <Link href={companyRoute.create().url} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                        Create Company
                                    </Link>
                                </div>
                            </div>

                            <table className="min-w-full table-auto border-collapse border border-gray-200">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 px-2 py-2">ID</th>
                                        <th className="border border-gray-300 px-2 py-2">Name</th>
                                        <th className="border border-gray-300 px-2 py-2">Address</th>
                                        <th className="border border-gray-300 px-2 py-2">Industry</th>
                                        <th className="border border-gray-300 px-2 py-2">Status</th>
                                        <th className="border border-gray-300 px-2 py-2 w-170px">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        companies.length > 0 ?
                                            companies.map((company: any) => (
                                                <tr key={company.id}>
                                                    <td className="border border-gray-300 px-2 py-2">{company.id}</td>
                                                    <td className="border border-gray-300 px-2 py-2">{company.name}</td>
                                                    <td className="border border-gray-300 px-2 py-2">{company.address}</td>
                                                    <td className="border border-gray-300 px-2 py-2">{company.industry}</td>
                                                    <td className="border border-gray-300 px-2 py-2 text-center">

                                                        <label className="inline-flex items-center cursor-pointer">
                                                            <input type="checkbox" value="" className="sr-only peer"
                                                                checked={company.is_active}
                                                                onChange={() => toggleStatus(company.id)} />
                                                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                                                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{company.is_active ? 'Active' : 'Inactive'}</span>
                                                        </label>

                                                    </td>
                                                    <td className="border border-gray-300 px-2 py-2 text-center">
                                                        <Link href={companyRoute.edit(company.id).url} className="m-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2.5 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Edit</Link>
                                                        <button
                                                            onClick={() => handleDelete(company.id)}
                                                            className="m-1 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2.5 py-1 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                            :
                                            <tr>
                                                <td colSpan={6} className="border border-gray-300 px-2 py-2 text-center">
                                                    No companies found.
                                                </td>
                                            </tr>
                                    }
                                </tbody>
                            </table>

                            <div className="mt-4 flex items-center justify-between">
                                <div className="mt-2">
                                    Total Companies: {company_data.total}
                                </div>
                                <div className="mt-4">
                                    {company_data.links.map((link: any, index: number) => (
                                        <a
                                            key={index}
                                            href={link.url}
                                            className={`mx-1 px-3 py-1 border rounded ${link.active ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        ></a>
                                    ))}

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}