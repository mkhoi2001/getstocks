import React from 'react';

type Props = {};

export const ActiveForm = (props: Props) => {
    return (
        <div>
            <h6 className="text-lg font-bold mb-5">Trạng thái hoạt động</h6>

            <div className="flex items-center gap-2">
                <label className="w-12 h-6 relative">
                    <input
                        // onChange={(e) => setIsEdit(e.target.checked)}
                        type="checkbox"
                        className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                        id="custom_switch_checkbox1"
                    />
                    <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                </label>
            </div>

            <button type="submit" className={` btn btn-primary !mt-6`}>
                {/* {isLoading ? (
                                    <span className="mr-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                ) : (
                                    ''
                                )} */}
                Lưu
            </button>
        </div>
    );
};

export default ActiveForm;
