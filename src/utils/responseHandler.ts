// export interface ApiResponse<T = any> {
//     success: boolean;
//     message: string;
//     statusCode: number;
//     data?: T;
// }

// export const buildResponse = <T = any>(
//     options: {
//         success: boolean;
//         message?: string;
//         statusCode?: number;
//         data?: T;
//     }
// ): ApiResponse<T> => {
//     return {
//         success: options.success,
//         message: options.message || (options.success ? "Success" : "An error occurred"),
//         statusCode: options.statusCode || (options.success ? 200 : 500),
//         ...(options.data !== undefined && { data: options.data }),
//     };
// };