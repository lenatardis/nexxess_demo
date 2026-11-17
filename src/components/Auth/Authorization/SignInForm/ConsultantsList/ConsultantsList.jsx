import React, { useEffect, useState, useRef, useCallback } from "react";
import { getConsultantsList } from "../../../../../api/authApi";
import Autocomplete from "@mui/material/Autocomplete";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import "./ConsultantsList.scss";
import arrow from '../../../../../assets/icons/accordionArrow.svg';

const ConsultantsList = ({ consultant, setConsultant }) => {
    const [list, setList] = useState([]);
    const [consultantsSize, setConsultantsSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(null);
    const hasMore = useRef(true);
    const isFetching = useRef(false);
    const listRef = useRef(null);
    const prevScrollTop = useRef(0);

    const fetchConsultants = useCallback(async (size) => {
        console.log('📢 fetchConsultants START');
        if (isFetching.current || !hasMore.current) return;
        isFetching.current = true;
        setLoading(true);

        if (listRef.current) {
            prevScrollTop.current = listRef.current.scrollTop;
            console.log("🔹 Saved Scroll Position:", prevScrollTop.current);
        }

        try {
            const response = await getConsultantsList(size);
            if (response?.results?.length) {
                setList((prevList) => {
                    const newConsultants = response.results.map(({ consultant_id, consultant_name }) => ({
                        id: consultant_id,
                        name: consultant_name,
                    }));

                    return [...new Map([...prevList, ...newConsultants].map(item => [item.id, item])).values()];
                });

                setTotalCount(response.count);
                if (list.length + response.results.length >= response.count) {
                    hasMore.current = false;
                }
            } else {
                hasMore.current = false;
            }
        } catch (error) {
            console.error("❌ Error fetching consultants:", error);
        } finally {
            setLoading(false);
            isFetching.current = false;

            if (listRef.current) {
                const observer = new MutationObserver(() => {
                    listRef.current.scrollTop = prevScrollTop.current;
                    console.log("✅ Restored Scroll Position:", listRef.current.scrollTop);
                    observer.disconnect(); // Зупиняємо спостереження після відновлення скролу
                });

                observer.observe(listRef.current, { childList: true, subtree: true });
            }
        }
    }, []);

    useEffect(() => {
        fetchConsultants(consultantsSize);
    }, []);

    const handleScroll = (event) => {
        console.log('🖱 handleScroll');
        const bottom = event.target.scrollHeight - event.target.scrollTop <= event.target.clientHeight + 10;
        if (bottom && !loading && hasMore.current && list.length < totalCount) {
            setConsultantsSize((prev) => prev + 10);
            fetchConsultants(consultantsSize + 10);
        }
    };

    return (
        <div className="inputBoxConsultant">
            <label className="inputBoxConsultant__label">Consultant</label>
            <Autocomplete
                id="consultant-autocomplete"
                options={list}
                getOptionLabel={(option) => option.name}
                value={list.find((c) => c.id === consultant) || null}
                onChange={(event, newValue) => setConsultant(newValue?.id || "")}
                onOpen={() => fetchConsultants(consultantsSize)}
                loading={loading}
                disableClearable
                freeSolo={false}
                PaperComponent={(props) => (
                    <Paper
                        {...props}
                        ref={listRef}
                        sx={{
                            maxHeight: "340px",
                            overflowY: "auto",
                            borderRadius: "33px",
                            paddingRight: '6px',
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                        }}
                    />
                )}
                ListboxProps={{
                    onScroll: handleScroll,
                    ref: listRef,
                    style: {
                        maxHeight: "340px",
                        overflowY: "auto",
                    },
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={consultant ? "" : "Select Consultant"}
                        InputLabelProps={{
                            shrink: false,
                        }}
                        sx={{
                            "& .MuiInputBase-root": {
                                borderRadius: "33px",
                                backgroundColor: "#E4E7E9",
                                // Demo: same height as the other fields of the page (Auth.module.scss)
                                height: "var(--input-height, 60px)",
                                border: "none",
                                display: "flex",
                                alignItems: "center",
                                paddingRight: "40px",
                                // Demo: with MUI's 5px input padding the picked name starts 20px in, like the placeholder
                                // and the other fields' text (was MUI's 9px)
                                paddingLeft: "15px",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                            },
                            "& .MuiInputBase-input": {
                                color: "#0A1329",
                                fontSize: "var(--input-font-size, 18px)",
                                fontWeight: "700",
                                lineHeight: "24px",
                                padding: "12px 16px",
                                cursor: "pointer",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                            },
                            "& .MuiAutocomplete-endAdornment": {
                                display: "none",
                            },
                        }}
                        inputProps={{
                            ...params.inputProps,
                            readOnly: true,
                        }}
                    />
                )}
                renderOption={(props, option) => (
                    <MenuItem {...props} key={option.id} value={option.id}>
                        {option.name}
                    </MenuItem>
                )}
            />
            <span className={'customArrow'}><img src={arrow} alt=""/></span>
        </div>
    );
};

export default ConsultantsList;
