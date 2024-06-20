import { getAllOrverview } from '../../../services/dashboardService';
import { useQuery } from '@tanstack/react-query';
import { getGetstockBalance } from '../../../services/systemService';
import toast from 'react-hot-toast';

type Props = {};

export const Box = (props: Props) => {
    const { data, error }: { data: any; error: any } = useQuery({
        queryKey: ['overview'],
        queryFn: getAllOrverview,
    });

    const {
        data: dataBalance,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ['balance'],
        queryFn: getGetstockBalance,
    });

    return (
        <div>
            {error ? error?.message : ''}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6 text-white">
                <div className="panel bg-gradient-to-r from-cyan-500 to-cyan-400">
                    <div className="flex justify-between">
                        <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Người dùng</div>
                        <div className="dropdown">
                            <svg className="w-5 h-5 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center mt-5 ">
                        <div className="text-4xl font-bold ltr:mr-3 rtl:ml-3"> {data?.data?.user.total}</div>
                        <div className="mx-auto flex flex-col ">
                            <div className="badge bg-white/30  flex items-center font-semibold ">Tháng này {data?.data?.user?.month}</div>
                            <div className="badge bg-white/30  flex items-center font-semibold ">Tuần này {data?.data?.user?.week}</div>
                            <div className="badge bg-white/30  flex items-center font-semibold ">Hôm nay {data?.data?.user?.day}</div>
                        </div>
                        {/* <div className="badge bg-white/30">+ 2.35% </div> */}
                    </div>
                </div>

                {/* Sessions */}
                <div className="panel bg-gradient-to-r from-violet-500 to-violet-400">
                    <div className="flex justify-between">
                        <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Lượt tải</div>
                        <div className="dropdown">
                            <svg className="w-5 h-5 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center mt-5">
                        <div className="text-4xl font-bold ltr:mr-3 rtl:ml-3"> {data?.data?.item.total} </div>
                        <div className="mx-auto flex flex-col ">
                            <div className="badge bg-white/30  flex items-center font-semibold ">Tháng này {data?.data?.item?.month}</div>
                            <div className="badge bg-white/30  flex items-center font-semibold ">Tuần này {data?.data?.item?.week}</div>
                            <div className="badge bg-white/30  flex items-center font-semibold ">Hôm nay {data?.data?.item?.day}</div>
                        </div>
                        {/* <div className="badge bg-white/30">- 2.35% </div> */}
                    </div>
                </div>

                {/*  Time On-Site */}
                <div className="panel bg-gradient-to-r from-blue-500 to-blue-400">
                    <div className="flex justify-between">
                        <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Lượt nạp</div>
                        <div className="dropdown">
                            <svg className="w-5 h-5 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center mt-5">
                        <div className="text-4xl font-bold ltr:mr-3 rtl:ml-3"> {data?.data?.order.total} </div>
                        <div className="mx-auto flex flex-col ">
                            <div className="badge bg-white/30  flex items-center font-semibold ">Tháng này {data?.data?.order?.month}</div>
                            <div className="badge bg-white/30  flex items-center font-semibold ">Tuần này {data?.data?.order?.week}</div>
                            <div className="badge bg-white/30  flex items-center font-semibold ">Hôm nay {data?.data?.order?.day}</div>
                        </div>
                        {/* <div className="badge bg-white/30">+ 1.35% </div> */}
                    </div>
                </div>

                {/* Bounce Rate */}
                <div className="panel bg-gradient-to-r from-fuchsia-500 to-fuchsia-400">
                    <div className="flex justify-between">
                        <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Số dư getstocks</div>
                    </div>
                    <div className="flex items-center mt-5 justify-between">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">$ {dataBalance?.data?.balance} </div>
                        <button disabled={isFetching} className={`${isFetching ? 'opacity-20' : 'opacity-100'} btn btn-secondary`} onClick={() => refetch()}>
                            {isFetching ? <span className="mr-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span> : ''}
                            Cập nhật
                        </button>
                    </div>
                    <div className="flex items-center font-semibold mt-5"></div>
                </div>
            </div>
        </div>
    );
};

export default Box;
