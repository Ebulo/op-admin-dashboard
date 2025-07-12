/* eslint-disable @next/next/no-img-element */
export const offerData = [
    {
        "id": 48,
        "package_name": "com.winzo.platform",
        "source": null,
        "name": "Review WinZO: Ludo",
        "description": "Play Ludo & Snakes and Ladders Online – No Money Needed! Fun & Easy",
        "offer_image": "https://play-lh.googleusercontent.com/ItApkpqhqaVFVzfTDfre7x7aOfr-dzC9Ks0XP69CbFizFsKLr0rtGvbr4HLnSvamNbA-=w480-h960-rw",
        "est_time": "5 Min",
        "enabled": true,
        "offer_link": "https://play.google.com/store/apps/details?id=com.winzo.platform",
        "target": 3000,
        "completion": 2454,
        "daily_target": 0,
        "daily_completion": 0,
        "paused": false,
        "cpc": "0.030",
        "archived": false,
        "countries": [
            "IN"
        ],
        "created_on": "2025-03-28T12:40:03.778669+05:30",
        "updated_at": "2025-03-23T22:58:15.917852+05:30",
        "advertiser": null,
        "task_type": {
            "id": 2,
            "name": "Review And Earn",
            "description": "{\r\n\"1\": \"Click on the button at bottom to start the offer.\",\r\n\"2\": \"You will be redirected to the play store page of the app.\",\r\n\"3\": \"Download the app and use it for 2 minutes.\",\r\n\"4\": \"Rate the app 5 star (compulsory) and write a nice review for the app.\",\r\n\"5\": \"Take the screenshot to verify that you have successfully reviewed the app.\",\r\n\"6\": \"Come back and click over upload button to upload the screenshot.\",\r\n\"7\": \"Click on Submit button. And wait for the offer to be approved. Once approved coins will be credited to your account.\"\r\n}",
            "est_time_to_complete": "1 Day",
            "image_url": "https://server.offerpro.io/static/review.png",
            "created_on": "2025-03-04T19:15:09.166899+05:30",
            "updated_at": "2024-10-29T14:12:37.183000+05:30"
        },
        "reward_coins": 90.0
    }
]

import Badge from "@/components/ui/badge/Badge";
import { BtnBdg } from "@/components/ui/button/Buttons";
// import { BadgeButton } from "@/components/ui/button/Buttons";

interface Offer {
    offer_image: string;
    name: string;
    task_type: {
        name: string;
    };
    created_on: string;
    target: number;
    completion: number;
    paused: boolean;
    enabled: boolean;
}

export const columns = [
    {
        header: "Offer Image",
        accessor: "offer_image",
        render: (offer: Offer) => (
            <img src={offer.offer_image} width={40} height={40} alt={offer.name} style={{ borderRadius: "10px" }} />
        ),
    },
    { header: "Offer Name", accessor: "name" },
    { header: "Offer Type", accessor: "task_type.name" },
    { header: "Created Date", accessor: "created_on" },
    { header: "Target", accessor: "target" },
    { header: "Completion", accessor: "completion" },
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
        accessor: "enabled",
        render: (offer: Offer) => (
            <Badge size="sm" color={offer.paused ? "error" : "success"}>
                {offer.enabled ? "Paused" : "Active"}
            </Badge>
        ),
    },
    {
        header: "Paused",
        accessor: "paused",
        render: (offer: Offer) => (
            <Badge size="sm" color={offer.paused ? "error" : "success"}>
                {offer.paused ? "Paused" : "Active"}
            </Badge>
        ),
    },
    {
        header: "Archive",
        accessor: "paused",
        render: (offer: Offer) => (
            <Badge size="sm" color={offer.paused ? "error" : "success"}>
                {offer.paused ? "Paused" : "Active"}
            </Badge>
        ),
    },
];