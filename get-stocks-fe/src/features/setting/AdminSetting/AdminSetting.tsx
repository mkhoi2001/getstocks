import { toggleAnimation, toggleLayout, toggleMenu, toggleNavbar, toggleRTL, toggleTheme, toggleSemidark } from '../../../store/themeAdminConfigSlice';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store';

type Props = {};

export const AdminSetting = (props: Props) => {
    const themeAdminConfig = useSelector((state: IRootState) => state.themeAdminConfig);
    const dispatch = useDispatch();
    return (
        <div className="bg-white max-w-[800px]">
            <div className="perfect-scrollbar h-full">
                <div className="text-center relative pb-5">
                    {/* <h4 className="mb-1 dark:text-white">TEMPLATE CUSTOMIZER</h4> */}
                    {/* <p className="text-white-dark">Set preferences that will be cookied for your live preview demonstration.</p> */}
                </div>

                <div className="border border-dashed border-white-light dark:border-[#1b2e4b] rounded-md mb-3 p-3">
                    <h5 className="mb-1 text-base dark:text-white leading-none">Màu nền</h5>
                    {/* <p className="text-white-dark text-xs">Overall light or dark presentation.</p> */}
                    <div className="grid grid-cols-3 gap-2 mt-3">
                        <button type="button" className={`${themeAdminConfig.theme === 'light' ? 'btn-primary' : 'btn-outline-primary'} btn`} onClick={() => dispatch(toggleTheme('light'))}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0 ltr:mr-2 rtl:ml-2">
                                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5"></circle>
                                <path d="M12 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                <path d="M12 20V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                <path d="M4 12L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                <path d="M22 12L20 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                <path opacity="0.5" d="M19.7778 4.22266L17.5558 6.25424" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                <path opacity="0.5" d="M4.22217 4.22266L6.44418 6.25424" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                <path opacity="0.5" d="M6.44434 17.5557L4.22211 19.7779" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                <path opacity="0.5" d="M19.7778 19.7773L17.5558 17.5551" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                            </svg>
                            Sáng
                        </button>

                        <button type="button" className={`${themeAdminConfig.theme === 'dark' ? 'btn-primary' : 'btn-outline-primary'} btn`} onClick={() => dispatch(toggleTheme('dark'))}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0 ltr:mr-2 rtl:ml-2">
                                <path
                                    d="M21.0672 11.8568L20.4253 11.469L21.0672 11.8568ZM12.1432 2.93276L11.7553 2.29085V2.29085L12.1432 2.93276ZM21.25 12C21.25 17.1086 17.1086 21.25 12 21.25V22.75C17.9371 22.75 22.75 17.9371 22.75 12H21.25ZM12 21.25C6.89137 21.25 2.75 17.1086 2.75 12H1.25C1.25 17.9371 6.06294 22.75 12 22.75V21.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75V1.25C6.06294 1.25 1.25 6.06294 1.25 12H2.75ZM15.5 14.25C12.3244 14.25 9.75 11.6756 9.75 8.5H8.25C8.25 12.5041 11.4959 15.75 15.5 15.75V14.25ZM20.4253 11.469C19.4172 13.1373 17.5882 14.25 15.5 14.25V15.75C18.1349 15.75 20.4407 14.3439 21.7092 12.2447L20.4253 11.469ZM9.75 8.5C9.75 6.41182 10.8627 4.5828 12.531 3.57467L11.7553 2.29085C9.65609 3.5593 8.25 5.86509 8.25 8.5H9.75ZM12 2.75C11.9115 2.75 11.8077 2.71008 11.7324 2.63168C11.6686 2.56527 11.6538 2.50244 11.6503 2.47703C11.6461 2.44587 11.6482 2.35557 11.7553 2.29085L12.531 3.57467C13.0342 3.27065 13.196 2.71398 13.1368 2.27627C13.0754 1.82126 12.7166 1.25 12 1.25V2.75ZM21.7092 12.2447C21.6444 12.3518 21.5541 12.3539 21.523 12.3497C21.4976 12.3462 21.4347 12.3314 21.3683 12.2676C21.2899 12.1923 21.25 12.0885 21.25 12H22.75C22.75 11.2834 22.1787 10.9246 21.7237 10.8632C21.286 10.804 20.7293 10.9658 20.4253 11.469L21.7092 12.2447Z"
                                    fill="currentColor"
                                ></path>
                            </svg>
                            Tối
                        </button>

                        <button type="button" className={`${themeAdminConfig.theme === 'system' ? 'btn-primary' : 'btn-outline-primary'} btn`} onClick={() => dispatch(toggleTheme('system'))}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ltr:mr-2 rtl:ml-2 shrink-0">
                                <path
                                    opacity="0.5"
                                    d="M7.142 18.9706C5.18539 18.8995 3.99998 18.6568 3.17157 17.8284C2 16.6569 2 14.7712 2 11C2 7.22876 2 5.34315 3.17157 4.17157C4.34315 3 6.22876 3 10 3H14C17.7712 3 19.6569 3 20.8284 4.17157C22 5.34315 22 7.22876 22 11C22 14.7712 22 16.6569 20.8284 17.8284C20.0203 18.6366 18.8723 18.8873 17 18.965"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M9.94955 16.0503C10.8806 15.1192 11.3461 14.6537 11.9209 14.6234C11.9735 14.6206 12.0261 14.6206 12.0787 14.6234C12.6535 14.6537 13.119 15.1192 14.0501 16.0503C16.0759 18.0761 17.0888 19.089 16.8053 19.963C16.7809 20.0381 16.7506 20.1112 16.7147 20.1815C16.2973 21 14.8648 21 11.9998 21C9.13482 21 7.70233 21 7.28489 20.1815C7.249 20.1112 7.21873 20.0381 7.19436 19.963C6.91078 19.089 7.92371 18.0761 9.94955 16.0503Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                />
                            </svg>
                            Màu hệ thống
                        </button>
                    </div>
                </div>

                <div className="border border-dashed border-white-light dark:border-[#1b2e4b] rounded-md mb-3 p-3">
                    <h5 className="mb-1 text-base dark:text-white leading-none">Vị trí Navigation</h5>
                    <div className="grid grid-cols-3 gap-2 mt-3">
                        <button type="button" className={`${themeAdminConfig.menu === 'horizontal' ? 'btn-primary' : 'btn-outline-primary'} btn`} onClick={() => dispatch(toggleMenu('horizontal'))}>
                            Chiều ngang
                        </button>

                        <button type="button" className={`${themeAdminConfig.menu === 'vertical' ? 'btn-primary' : 'btn-outline-primary'} btn`} onClick={() => dispatch(toggleMenu('vertical'))}>
                            Chiều dọc
                        </button>

                        <button
                            type="button"
                            className={`${themeAdminConfig.menu === 'collapsible-vertical' ? 'btn-primary' : 'btn-outline-primary'} btn`}
                            onClick={() => dispatch(toggleMenu('collapsible-vertical'))}
                        >
                            Thu gọn
                        </button>
                    </div>
                    <div className="mt-5 text-primary">
                        <label className="inline-flex mb-0">
                            <input
                                type="checkbox"
                                className="form-checkbox"
                                checked={themeAdminConfig.semidark === true || themeAdminConfig.semidark === 'true'}
                                onChange={(e) => dispatch(toggleSemidark(e.target.checked))}
                            />
                            <span>Nền tối Navigation</span>
                        </label>
                    </div>
                </div>

                <div className="border border-dashed border-white-light dark:border-[#1b2e4b] rounded-md mb-3 p-3">
                    <h5 className="mb-1 text-base dark:text-white leading-none">Kiểu Navbar</h5>
                    <div className="mt-3 flex items-center gap-3 text-primary">
                        <label className="inline-flex mb-0">
                            <input
                                type="radio"
                                checked={themeAdminConfig.navbar === 'navbar-sticky'}
                                value="navbar-sticky"
                                className="form-radio"
                                onChange={() => dispatch(toggleNavbar('navbar-sticky'))}
                            />
                            <span>Sticky</span>
                        </label>
                        <label className="inline-flex mb-0">
                            <input
                                type="radio"
                                checked={themeAdminConfig.navbar === 'navbar-floating'}
                                value="navbar-floating"
                                className="form-radio"
                                onChange={() => dispatch(toggleNavbar('navbar-floating'))}
                            />
                            <span>Floating</span>
                        </label>
                        <label className="inline-flex mb-0">
                            <input
                                type="radio"
                                checked={themeAdminConfig.navbar === 'navbar-static'}
                                value="navbar-static"
                                className="form-radio"
                                onChange={() => dispatch(toggleNavbar('navbar-static'))}
                            />
                            <span>Static</span>
                        </label>
                    </div>
                </div>

                <div className="border border-dashed border-white-light dark:border-[#1b2e4b] rounded-md mb-3 p-3">
                    <h5 className="mb-1 text-base dark:text-white leading-none">Router Transition</h5>
                    <div className="mt-3">
                        <select className="form-select border-primary text-primary" value={themeAdminConfig.animation} onChange={(e) => dispatch(toggleAnimation(e.target.value))}>
                            <option value=" ">Select Animation</option>
                            <option value="animate__fadeIn">Fade</option>
                            <option value="animate__fadeInDown">Fade Down</option>
                            <option value="animate__fadeInUp">Fade Up</option>
                            <option value="animate__fadeInLeft">Fade Left</option>
                            <option value="animate__fadeInRight">Fade Right</option>
                            <option value="animate__slideInDown">Slide Down</option>
                            <option value="animate__slideInLeft">Slide Left</option>
                            <option value="animate__slideInRight">Slide Right</option>
                            <option value="animate__zoomIn">Zoom In</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSetting;
