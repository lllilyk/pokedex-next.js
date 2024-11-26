import React from "react";

const PokeDetailPage = ({ data, }: {
    id: string, 
    data: {
        name: string;
        effect_entries: {
            effect: string;
            short_effect: string;
        }[];
    }
}): React.JSX.Element => {
	return (
        <div className="w-full flex justify-center items-center">{data?.name}</div>
    );   
};

export default PokeDetailPage;