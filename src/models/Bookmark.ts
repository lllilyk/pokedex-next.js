import mongoose, { Schema } from "mongoose";

const bookmarkSchema = new Schema({
    userId: { type: String, required: true },
    pokemonId: { type: Number, required: true },
    name: { type: String, required: true },
    koreanName: { type: String, required: true },
    sprites: {
        front_default: { type: String, required: true }
    }
}, {
    timestamps: true
});

// 복합 인덱스 생성: 한 사용자(userId)는 같은 포켓몬(pokemonId)을 중복해서 북마크할 수 없다
// MongoDB에서 1은 오름차순, -1은 내림차순
// { userId: 1, pokemonId: 1}: 단순히 두 필드를 조합해서 인덱스를 만든다는 의미
// { unique: true }: 중복 방지 설정 옵션 - 이 조합이 고유해야 함을 의미
bookmarkSchema.index({ userId: 1, pokemonId: 1 }, { unique: true });

const Bookmark = mongoose.models.Bookmark || mongoose.model("Bookmark", bookmarkSchema);
export default Bookmark;