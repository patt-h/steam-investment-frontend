import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete } from '@mui/material';
import { fetchItems } from './ItemListApi';

const AutoCompleteInput = ({ value, onChange }) => {
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState(value || '');

    useEffect(() => {
        const fetchOptions = async () => {
            if (inputValue.length > 3) {
                const fetchedOptions = await fetchItems(inputValue);
                setOptions(fetchedOptions);
            } else {
                setOptions([]);
            }
        };

        fetchOptions();
    }, [inputValue]);

    return (
        <Autocomplete
            freeSolo
            options={options}
            getOptionLabel={(option) => option.marketHashName || ''}
            value={options.find(option => option.marketHashName === value) || null}
            onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
            onChange={(event, newValue) => onChange(newValue ? newValue.marketHashName : '')}
            renderInput={(params) => (
                <TextField 
                    {...params} 
                    label="Name" 
                    margin="normal" 
                    fullWidth 
                    sx={{ minWidth: 400 }}
                />
            )}
            isOptionEqualToValue={(option, value) => option.marketHashName === value}
        />
    );
};

export default AutoCompleteInput;
