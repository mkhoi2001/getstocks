import React from 'react';

type Props = {};

export const PackageInfo = (props: Props) => {
    return (
        <div className="panel p-3 lg:p-5 text-center rounded group hover:border-primary">
            <h3 className="text-xl lg:text-2xl">Beginner Savers</h3>
            <div className="border-t border-black dark:border-white-dark w-1/5 mx-auto my-6 group-hover:border-primary"></div>
            <p className="text-[15px]">For people who are starting out in the water saving business</p>
            <div className="my-7 p-2.5 text-center text-lg group-hover:text-primary">
                <strong className="text-[#3b3f5c] dark:text-white-dark text-3xl lg:text-5xl group-hover:text-primary">$19</strong> / monthly
            </div>
            <ul className="space-y-2.5 mb-5 font-semibold group-hover:text-primary">
                <li className="flex justify-center items-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180">
                        <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Free water saving e-book
                </li>
                <li className="flex justify-center items-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180">
                        <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Free access to forums
                </li>
                <li className="flex justify-center items-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180">
                        <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Beginners tips
                </li>
            </ul>
            <button
                type="button"
                className="btn text-black shadow-none group-hover:text-primary group-hover:border-primary group-hover:bg-primary/10 dark:text-white-dark dark:border-white-dark/50 w-full"
            >
                Buy Now
            </button>
        </div>
    );
};
