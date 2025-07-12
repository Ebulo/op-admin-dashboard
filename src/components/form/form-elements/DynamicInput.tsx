"use client";
import React, { useState, ChangeEvent } from "react";
import Input from "../input/InputField";
import Label from "../Label";
import Select from "../Select";
import DatePicker from "@/components/form/date-picker";
import { EyeIcon, EyeCloseIcon, ChevronDownIcon, TimeIcon } from "../../../icons";

interface InputProps {
    label?: string;
    type: "text" | "password" | "email" | "select" | "date" | "time";
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    options?: { value: string; label: string }[];
    id?: string;
    name?: string;
    className?: string;
    showIcon?: boolean;
}

const DynamicInput: React.FC<InputProps> = ({
    label,
    type,
    placeholder = "",
    // value = "", // Ensure default empty string to avoid undefined issues
    onChange,
    options = [],
    id = "", // Ensure ID is not undefined
    name = "",
    className = "",
    showIcon = false,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (onChange) onChange(e.target.value);
    };

    return (
        <div className="relative space-y-2">
            {label && <Label htmlFor={id}>{label}</Label>}

            {/* Text, Email, Password */}
            {(type === "text" || type === "email" || type === "password") && (
                <div className="relative">
                    <Input
                        type={type === "password" && showPassword ? "text" : type}
                        id={id}
                        name={name}
                        placeholder={placeholder}
                        // value={value}
                        onChange={handleChange}
                        className={className}
                    />
                    {type === "password" && (
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                            ) : (
                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                            )}
                        </button>
                    )}
                </div>
            )}

            {/* Select Dropdown */}
            {type === "select" && (
                <div className="relative">
                    <Select
                        options={options}
                        placeholder={placeholder}
                        onChange={(value) => onChange?.(value)}
                        className={className}
                    />
                    {showIcon && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                            <ChevronDownIcon />
                        </span>
                    )}
                </div>
            )}

            {/* Date Picker */}
            {type === "date" && (
                <DatePicker
                    id={id}
                    label={label}
                    placeholder={placeholder}
                    onChange={(dates, currentDateString) => {
                        onChange?.(currentDateString);
                    }}
                />
            )}

            {/* Time Input */}
            {type === "time" && (
                <div className="relative">
                    <Input type="time" id={id} name={name}
                        //  value={value} 
                        onChange={handleChange} />
                    {showIcon && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                            <TimeIcon />
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default DynamicInput;