import { Grid, OutlinedInput } from "@mui/material"
import React, { ChangeEvent, createRef, useCallback, useEffect, useMemo, useState } from "react"

interface IVerification {
    code?: string,
    placeholder?: string,
    onChange?: (e: string) => void,
    onCompleted?: (data: string) => void,
    length?: number,
    autoFocus?: boolean,
    type?: string
}


const VerificationCode: React.FC<IVerification> = (props) => {

    const {
        code: defaultValue = '',
        placeholder = '.',
        onChange = () => null,
        onCompleted = () => null,
        length = 6,
        autoFocus = false,
        type = 'number'
    } = props

    const fillValues = (value: string) =>
        new Array(length).fill('').map((_, index) => value[index] ?? '');

    const [values, setValues] = useState(fillValues(defaultValue));
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);

    const inputsRefs = useMemo(
        () => new Array(length).fill(null).map(() => createRef<HTMLInputElement>()),
        [length]
    );

    const validate = (input: string) => {
        if (type === 'number') {
            return /^\d/.test(input);
        }

        if (type === 'alphanumeric') {
            return /^[a-zA-Z0-9]/.test(input);
        }

        return true;
    };

    const selectInputContent = (index: number) => {
        const input = inputsRefs[index].current;

        if (input) {
            requestAnimationFrame(() => {
                input.select();
            });
        }
    };

    const setValue = (value: string, index: number) => {
        const nextValues = [...values];
        nextValues[index] = value;

        setValues(nextValues);

        const stringifiedValues = nextValues.join('');
        const isCompleted = stringifiedValues.length === length;

        if (isCompleted) {
            onCompleted(stringifiedValues);
            return;
        }

        onChange(stringifiedValues);
    };

    const focusInput = useCallback(
        (index: number) => {
            const input = inputsRefs[index]?.current;

            if (input) {
                requestAnimationFrame(() => {
                    input.focus();
                });
            }
        },
        [inputsRefs]
    );

    const blurInput = (index: number) => {
        const input = inputsRefs[index]?.current;

        if (input) {
            requestAnimationFrame(() => {
                input.blur();
            });
        }
    };

    const onInputFocus = (index: number) => {
        const input = inputsRefs[index]?.current;

        if (input) {
            setFocusedIndex(index);
            selectInputContent(index);
        }
    };

    const onInputChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        index: number
    ) => {
        const eventValue = event.target.value;
        /**
         * ensure we only display 1 character in the input
         * by clearing the already setted value
         */
        const value = eventValue.replace(values[index], '');

        /**
         * if the value is not valid, don't go any further
         * and select the content of the input for a better UX
         */
        if (!validate(value)) {
            selectInputContent(index);
            return;
        }

        /**
         * otp code
         */
        if (value.length > 1) {
            setValues(fillValues(eventValue));

            const isCompleted = eventValue.length === length;

            if (isCompleted) {
                onCompleted(eventValue);
                blurInput(index);
                return;
            }

            return;
        }

        setValue(value, index);

        /**
         * if the input is the last of the list
         * blur it, otherwise focus the next one
         */
        if (index === length - 1) {
            blurInput(index);
            return;
        }

        focusInput(index + 1);
    };

    const onInputKeyDown = (
        event: any,
        index: number
    ) => {
        const eventKey = event.key;

        if (eventKey === 'Backspace' || eventKey === 'Delete') {
            /**
             * prevent trigger a change event
             * `onInputChange` won't be called
             */
            event.preventDefault();

            setValue('', focusedIndex);
            focusInput(index - 1);

            return;
        }

        /**
         * since the value won't change, `onInputChange` won't be called
         * only focus the next input
         */
        if (eventKey === values[index]) {
            focusInput(index + 1);
        }
    };

    const onInputPaste = (
        event: any,
        index: number
    ) => {
        event.preventDefault();

        const pastedValue = event.clipboardData.getData('text');
        const nextValues = pastedValue.slice(0, length);

        if (!validate(nextValues)) {
            return;
        }

        setValues(fillValues(nextValues));

        const isCompleted = nextValues.length === length;

        if (isCompleted) {
            onCompleted(nextValues);
            blurInput(index);
            return;
        }

        focusInput(nextValues.length);
    };

    /**
     * autoFocus
     */
    useEffect(() => {
        if (autoFocus) {
            focusInput(0);
        }
    }, [autoFocus, focusInput, inputsRefs]);

    return (
        <Grid
            container
            justifyContent={'center'}
            spacing={1}>

            {
                inputsRefs.map((ref, i) => (
                    <Grid item key={i}>
                        <OutlinedInput
                            size={'small'}
                            onChange={(event) => onInputChange(event, i)}
                            onFocus={() => onInputFocus(i)}
                            onKeyDown={(event) => onInputKeyDown(event, i)}
                            onPaste={(event) => onInputPaste(event, i)}
                            placeholder={placeholder}
                            inputRef={ref}
                            inputProps={{
                                maxLength: 1,
                            }}
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                '& input': {
                                    margin: 'auto',
                                    padding: 0,
                                    textAlign: 'center'
                                }
                            }}
                            value={values[i]}
                        />
                    </Grid>
                ))
            }
        </Grid>
    )
}

export { VerificationCode }
