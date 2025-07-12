/* eslint-disable @next/next/no-img-element */
export const advertiserData = [
    {
        "name": "Cash Monkey",
        "profile_photo": "https://soyacincau.com/wp-content/uploads/2020/09/200925-ponyo049.jpg",
        "email": "cashcraftllc@gmail.com",
        "created_on": "24 Dec 2024",
        "updated_at": "20 Feb 2025",
        "phone": "7008381104",
        "status": "Pending",
    },
    {
        "name": "Snoopy Star",
        "profile_photo": "https://m.media-amazon.com/images/M/MV5BZTUwOWNhNGEtM2I2OC00OTFjLTk2YjYtNTQ5ODQ0YjMzMzhjXkEyXkFqcGdeQXVyNzYyNDI5ODg@._V1_.jpg",
        "email": "cashcraftllc@gmail.com",
        "created_on": "24 Dec 2024",
        "updated_at": "20 Feb 2025",
        "phone": "7008381104",
        "status": "Pending",
    },
    {
        "name": "Cash Monkey",
        "profile_photo": "https://soyacincau.com/wp-content/uploads/2020/09/200925-ponyo049.jpg",
        "email": "cashcraftllc@gmail.com",
        "created_on": "24 Dec 2024",
        "updated_at": "20 Feb 2025",
        "phone": "7008381104",
        "status": "Pending",
    },
    {
        "name": "Cash Monkey",
        "profile_photo": "https://soyacincau.com/wp-content/uploads/2020/09/200925-ponyo049.jpg",
        "email": "cashcraftllc@gmail.com",
        "created_on": "24 Dec 2024",
        "updated_at": "20 Feb 2025",
        "phone": "7008381104",
        "status": "Pending",
    },
]

import Badge from "@/components/ui/badge/Badge";
import { BtnBdg } from "@/components/ui/button/Buttons";
import { DeleteIcon } from "@/icons";
// import { BadgeButton } from "@/components/ui/button/Buttons";

interface Advertiser {
    name: string;
    profile_photo: string;
    email: string;
    phone: string;
    created_on: string;
    updated_at: string;
    status: string;
}

export const columns = [
    {
        header: "Name",
        accessor: "name",
        render: (advert: Advertiser) => (
            // <img src={advert.name} width={40} height={40} alt={advert.name} />
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img src={advert.profile_photo} width={40} height={40} alt={advert.name} style={{ borderRadius: "50%", width: "40px", height: "40px", objectFit: "cover" }} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: "bold" }}>{advert.name}</span>
                    <span style={{ fontSize: "0.8em", color: "#888" }}>{advert.email}</span>
                </div>
            </div>
        ),
    },
    { header: "Email", accessor: "name" },
    { header: "Phone Number", accessor: "phone" },
    { header: "Created Date", accessor: "created_on" },
    { header: "Updated Date", accessor: "updated_at" },
    {
        header: "Edit",
        accessor: "paused",
        // render: (offer: Offer) => (
        //     <BtnBdg>Edit</BtnBdg>
        // ),
        render: () => (
            <BtnBdg>Edit</BtnBdg>
        ),
    },
    {
        header: "Status",
        accessor: "status",
        render: (advert: Advertiser) => (
            <Badge size="sm" color={advert.status ? "error" : "success"}>
                {advert.status ? "Paused" : "Active"}
            </Badge>
        ),
    },
    {
        header: "Delete",
        accessor: "delete",
        render: () => (
            <div>
                <DeleteIcon />
            </div>
        ),
    },
];
