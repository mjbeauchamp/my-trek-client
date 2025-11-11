import React from "react";
import { useParams } from "react-router";

export default function GearList() {
    const {listId} = useParams();
    return (
        <div>
            GEAR LIST {listId}
        </div>
    )
}