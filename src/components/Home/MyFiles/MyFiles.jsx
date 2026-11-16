import React, {useEffect, useState} from "react";
import Skeleton from "@mui/material/Skeleton";
import PurchasesFiles from "./PurchasesFiles/PurchasesFiles";
import {getAccessToken} from "../../../api/localStorage";
import {getNexxessFiles, getPurchases, getPurchasesFiles} from "../../../api/pagesApi";
import {setPurchases} from "../../../store/main-slice";
import {useAppDispatch} from "../../../hooks/redux";
import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";
import {Pagination} from "@mui/material";

const MyFiles = () => {
    const dispatch = useAppDispatch();
    const [files, setFiles] = useState(null);
    const [nexxessFiles, nexxessSetFiles] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filePage, setFilePage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchData = async (page = 1, includePurchasesFiles = true, filePage = 1) => {
        try {
            const token = await getAccessToken();
            let purchasesResponse;

            if (includePurchasesFiles) {
                const [purchasesResult, purchasesFilesResponse, NexxessFilesResponse] = await Promise.all([
                    getPurchases(token, page),
                    loadPurchasesFiles(token, filePage),
                    getNexxessFiles(token)
                ]);

                purchasesResponse = purchasesResult;

                if (NexxessFilesResponse?.results?.length) {
                    nexxessSetFiles(NexxessFilesResponse.results);
                }
            } else {
                purchasesResponse = await getPurchases(token, page);
            }
            if (purchasesResponse?.results?.length) {
                dispatch(setPurchases(purchasesResponse.results));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const loadPurchasesFiles = async (token, filePage) => {
        const response = await getPurchasesFiles(token, filePage);
        if (response?.results?.length) {
            setFiles(response.results);
            setTotalPages(response.total_pages);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePaginationChange = async (event, value) => {
        if (filePage !== value) {
            setFilePage(value);
            window.scrollTo({top: 0, behavior: 'auto'});
            const token = await getAccessToken();
            if (token) {
              await loadPurchasesFiles(token, value);
            }
        }
    }


    return (
        <div>
            <Breadcrumbs secondPage={{utl: '/MyFiles', name: 'My Files'}}/>
            <h3>My Files</h3>

            {isLoading ? (
                <Skeleton
                    variant="rounded"
                    width="100%"
                    height={104}
                    sx={{borderRadius: '33px'}}
                />
            ) : (
                <><PurchasesFiles files={files}/>
                    {totalPages > 1 && (
                    <Pagination
                        className={'mainPagination'}
                        count={totalPages}
                        page={filePage}
                        siblingCount={1}
                        boundaryCount={1}
                        onChange={handlePaginationChange}
                    />
                )}
                </>
            )}

            <h3>Nexxess Files</h3>

            {isLoading ? (
                <Skeleton
                    variant="rounded"
                    width="100%"
                    height={104}
                    sx={{borderRadius: '33px'}}
                />
            ) : (
                <PurchasesFiles files={nexxessFiles} isRow/>
            )}
        </div>
    )
}

export default MyFiles;