import AnimateHeight from 'react-animate-height';
import { useState } from 'react';

type Props = {};

export const GuideBox = (props: Props) => {
    const [active, setActive] = useState<boolean>(false);

    const toggleGuide = () => {
        setActive(!active);
    };

    return (
        <div className="panel mb-5 p-2">
            <div className="space-y-2 font-semibold">
                <div className="rounded dark:border-[#1b2e4b]">
                    <button type="button" className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] ${active ? '!text-primary' : ''}`} onClick={() => toggleGuide()}>
                        Hướng nhập Box hỗ trợ nội dung HTML
                        <div className={`ltr:ml-auto rtl:mr-auto ${active ? 'rotate-180' : ''}`}>
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 9L12 15L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </button>
                    <div>
                        <AnimateHeight duration={300} height={active ? 'auto' : 0}>
                            <div className="space-y-2  p-4  dark:text-white text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                <p className="text-lg">Render Html và Css ra giao diện</p>
                                <div className="font-mono text-slate-500">
                                    <div className="mb-3">
                                        <p className="text-black dark:text-white">Cách 1: Css internal</p>
                                        {`<style type="text/css"> .example {
                                        color:red;
                                    } </style> 
                                    `}
                                        <br />
                                        {`<p class="example">Example</p>`}
                                    </div>
                                    <div className="mb-3">
                                        <p className="text-black dark:text-white">Cách 2: Css inline</p>
                                        {`<p style="color:red;">Example</p>`}
                                    </div>
                                    <div className="mb-3">
                                        <p className="text-black dark:text-white">Cách 3: Dùng Tailwind CSS</p>
                                        {`<p class="text-red-500">Example</p>`}
                                    </div>
                                    <p className="italic text-red-500">*Có thể kết hợp nhiều cách</p>
                                </div>
                                <div>
                                    <p>Kết quả</p>
                                    <p style={{ color: 'red' }}>Example</p>
                                </div>
                            </div>
                        </AnimateHeight>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuideBox;
