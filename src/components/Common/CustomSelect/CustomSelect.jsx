import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import './CustomSelect.scss';


const CustomSelect = ({selectList, value, setValue}) => {

    return (
        <Box>
            <FormControl fullWidth>
                <Select
                    IconComponent={() => <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
                                              xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.75 5.625L7.5 9.375L11.25 5.625" stroke="#9497A9"/>
                    </svg>
                    }
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={value.name}

                    sx={{

                        backgroundColor: '#fff',
                        height: '38px',
                        borderRadius: '8px',
                        color: '#6B717F',
                    }}
                >
                    {selectList && selectList.length > 0 && (
                        selectList.map((item, index) => (
                            <MenuItem key={index} value={item.name} onClick={() => setValue(item)} >
                                <p>
                                    {item.name}
                                </p>
                            </MenuItem>
                        ))
                    )}
                </Select>
            </FormControl>
        </Box>
    )
}

export default CustomSelect;