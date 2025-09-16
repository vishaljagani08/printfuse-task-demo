import AppLayout from '@/layouts/app-layout';
import companyRoute from '@/routes/company';
import { type BreadcrumbItem } from '@/types';
import { Link, Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import * as yup from 'yup';

const schema = yup.object().shape({
    name: yup.string().required('Name is required').min(3, 'At least 3 characters'),
    address: yup.string().required('Address is required').min(3, 'At least 3 characters'),
    industry: yup.string().required('Industry is required').min(3, 'At least 3 characters'),
});

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Companies',
        href: companyRoute.index().url,
    },
    {
        title: 'Create',
        href: "#",
    },
];

export default function CompanyIndex() {
    const { data, setData, post, reset, processing, errors: backendErrors, } = useForm({
        name: '',
        address: '',
        industry: '',
    });

    const [frontendErrors, setFrontendErrors] = useState<{ [key: string]: string }>({});

    const validateField = async (field: any, value: any) => {
        try {
            await schema.validateAt(field, { ...data, [field]: value });
            setFrontendErrors((prev) => {
                const { [field]: removed, ...rest } = prev;
                return rest;
            });
        } catch (error: any) {
            setFrontendErrors((prev) => ({
                ...prev,
                [field]: error.message,
            }));
        }
    };

    const handleChange = (field:any) => (e:any) => {
        const value = e.target.value;
        setData(field, value);
        validateField(field, value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        try {
            await schema.validate(data, { abortEarly: false });
            setFrontendErrors({});

            post(companyRoute.store().url, {
                onSuccess: () => {
                    reset();
                }
            });
        } catch (err: any) {
            const formattedErrors: any = {};
            err.inner.forEach((e: any) => {
                formattedErrors[e.path] = e.message;
            });
            setFrontendErrors(formattedErrors);
        }

    }


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Companies" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4">
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="p-4">
                            <h2 className="text-lg font-semibold mb-4 float-left">Company Add</h2>
                            <form onSubmit={handleSubmit} className="mb-4 clear-both w-100" method="POST" action={companyRoute.create().url}>
                                <div className="mb-3 flex flex-col">
                                    <label className="clear-both">Name</label>
                                    <input type="text"
                                        value={data.name}
                                        onChange={handleChange('name')}
                                        name="name"
                                        className={`p-1 border border-gray-300 rounded ${backendErrors.name || frontendErrors.name ? 'border-red-500' : ''}`}
                                    />
                                    {frontendErrors.name && <p className="text-red-500 text-sm mt-1">{frontendErrors.name}</p>}
                                    {backendErrors.name && <p className="text-red-500 text-sm mt-1">{backendErrors.name}</p>}
                                </div>

                                <div className="mb-3 flex flex-col">
                                    <label className="clear-both">Address</label>
                                    <input type="text"
                                        value={data.address}
                                        onChange={handleChange('address')}
                                        name="address"
                                        className={`p-1 border border-gray-300 rounded ${backendErrors.address || frontendErrors.address ? 'border-red-500' : ''}`}
                                    />
                                    {frontendErrors.address && <p className="text-red-500 text-sm mt-1">{frontendErrors.address}</p>}
                                    {backendErrors.address && <p className="text-red-500 text-sm mt-1">{backendErrors.address}</p>}
                                </div>

                                <div className="mb-3 flex flex-col">
                                    <label className="clear-both">Industry</label>
                                    <input type="text"
                                        value={data.industry}
                                        onChange={handleChange('industry')}
                                        name="industry"
                                        className={`p-1 border border-gray-300 rounded ${backendErrors.industry || frontendErrors.industry ? 'border-red-500' : ''}`} />
                                    {frontendErrors.industry && <p className="text-red-500 text-sm mt-1">{frontendErrors.industry}</p>}
                                    {backendErrors.industry && <p className="text-red-500 text-sm mt-1">{backendErrors.industry}</p>}
                                </div>

                                <button type="submit"
                                    disabled={processing}
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                    {processing ? 'Submitting...' : 'Create'}
                                </button>
                                <Link href={companyRoute.index().url} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-3 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                                    Back to List
                                </Link>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}