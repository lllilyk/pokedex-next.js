import PokeDetailPage from "../../../components/Detail";
import axios from "axios";

interface DetailProps {
	params: {
		id: string;
	}
}

export const getServerSideProps = async ({ params }: DetailProps) => {

    const { data } = await axios.get(
        `https://pokeapi.co/api/v2/ability/${params.id}`
    );

	return {
        props: {
            id: params.id,
            data: data,
        }
	};
};

export default PokeDetailPage;