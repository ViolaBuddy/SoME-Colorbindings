// symmetric leapers
const WAZIR = [ [1,0],[0,1],[-1,0],[0,-1] ];
const FERZ = [ [1,1],[1,-1],[-1,1],[-1,-1] ];
const DABBAABA = [ [2,0],[0,2],[-2,0],[0,-2] ];
const ALFIL = [ [2,2],[2,-2],[-2,2],[-2,-2] ];
const THREELEAPER = [ [3,0],[0,3],[-3,0],[0,-3] ];
const KNIGHT = [ [1,2],[1,-2],[-1,2],[-1,-2],[2,1],[2,-1],[-2,1],[-2,-1] ];
const CAMEL = [ [1,3],[1,-3],[-1,3],[-1,-3],[3,1],[3,-1],[-3,1],[-3,-1] ];
const KING = WAZIR.concat(FERZ);
const fbHsD = [ [2,0],[0,3],[-2,0],[0,-3] ];
const NARROWKNIGHT = [ [1,2],[1,-2],[-1,2],[-1,-2] ];
const WIDEKNIGHT = [ [2,1],[-2,1],[2,-1],[-2,-1] ];

// symmetric riders and combination rider-leapers
const ROOK = [ [1,0,MovementCategory.Rider],[0,1,MovementCategory.Rider],[-1,0,MovementCategory.Rider],[0,-1,MovementCategory.Rider] ];
const BISHOP = [ [1,1,MovementCategory.Rider],[1,-1,MovementCategory.Rider],[-1,1,MovementCategory.Rider],[-1,-1,MovementCategory.Rider] ];
const DABBAABARIDER = [ [2,0,MovementCategory.Rider],[-2,0,MovementCategory.Rider],[0,2,MovementCategory.Rider],[0,-2,MovementCategory.Rider] ];
const ALFILRIDER = [ [2,2,MovementCategory.Rider],[2,-2,MovementCategory.Rider],[-2,2,MovementCategory.Rider],[-2,-2,MovementCategory.Rider] ];
const NIGHTRIDER = [ [1,2,MovementCategory.Rider],[1,-2,MovementCategory.Rider],[-1,2,MovementCategory.Rider],[-1,-2,MovementCategory.Rider],[2,1,MovementCategory.Rider],[2,-1,MovementCategory.Rider],[-2,1,MovementCategory.Rider],[-2,-1,MovementCategory.Rider] ];
const CAMELRIDER = [ [1,3,MovementCategory.Rider],[1,-3,MovementCategory.Rider],[-1,3,MovementCategory.Rider],[-1,-3,MovementCategory.Rider],[3,1,MovementCategory.Rider],[3,-1,MovementCategory.Rider],[-3,1,MovementCategory.Rider],[-3,-1,MovementCategory.Rider] ];
const QUEEN = ROOK.concat(BISHOP);
const DRAGONKING = ROOK.concat(FERZ);
const DRAGONHORSE = BISHOP.concat(WAZIR);

// asymmetric leapers and riders
const PAWN = [ [0,1] ];
const PROMOTEDSOLDIER = [ [1,0],[0,1],[-1,0] ];
const LANCE = [ [0,1,MovementCategory.Rider] ];
const LAURELHORSE = [ [1,2],[-1,2] ];
const SILVERGENERAL = [ [1,1],[1,-1],[-1,1],[-1,-1],[0,1] ];
const GOLDGENERAL = [ [1,0],[0,1],[-1,0],[0,-1],[1,1],[-1,1] ];

// special
const EXAMPLE1 = [ [3,2],[-3,-2],[4,3],[-4,-3],[5,1],[-5,-1] ];
const REDUCEDEXAMPLE1 = [ [1,1],[0,1],[-1,-1],[0,-1] ];
const EXAMPLE2 = [ [3,3],[0,6],[-3,-3],[0,-6] ];
const EXAMPLE2AUGMENTED = [ [3,3],[0,6],[-3,-3],[0,-6],[1,3] ];
const EXAMPLE3 = [ [1,1],[1,2],[1,3],[1,4] ];
const EXAMPLE4 = [ [1,2],[-1,2], [1,3] ];
const EXAMPLE4SYMMETRIC = [ [1,2],[-1,2],[1,3],[-1,-2],[1,-2],[-1,-3] ];

const ALL_MOVEMENTS_DICT = {
	'wazir': WAZIR,
	'ferz': FERZ,
	'dabbaaba': DABBAABA,
	'alfil': ALFIL,
	'threeleaper': THREELEAPER,
	'knight': KNIGHT,
	'camel': CAMEL,
	'king': KING,
	'fbHsD': fbHsD,
	'narrowknight': NARROWKNIGHT,
	'wideknight': WIDEKNIGHT,

	'rook': ROOK,
	'bishop': BISHOP,
	'dabbaabarider': DABBAABARIDER,
	'alfilrider': ALFILRIDER,
	'nightrider': NIGHTRIDER,
	'camelrider': CAMELRIDER,
	'queen': QUEEN,
	'dragonking': DRAGONKING,
	'dragonhorse': DRAGONHORSE,

	'pawn': PAWN,
	'promotedsoldier': PROMOTEDSOLDIER,
	'lance': LANCE,
	'laurelhorse': LAURELHORSE,
	'silvergeneral': SILVERGENERAL,
	'goldgeneral': GOLDGENERAL,

	'example1': EXAMPLE1,
	'reducedexample1': REDUCEDEXAMPLE1,
	'example2': EXAMPLE2,
	'example2augmented': EXAMPLE2AUGMENTED,
	'example3': EXAMPLE3,
	'example4': EXAMPLE4,
	'example4_symmetric': EXAMPLE4SYMMETRIC,
}
const ALL_NAMES_DICT = {
	'wazir': 'Wazir/General',
	'ferz': 'Ferz',
	'dabbaaba': 'Dabbaaba',
	'alfil': 'Alfil',
	'threeleaper': 'Threeleaper',
	'knight': 'Knight',
	'camel': 'Camel',
	'king': 'King',
	'fbHsD': 'fbHsD',
	'narrowknight': 'Narrow Knight',
	'wideknight': 'Wide Knight',

	'rook': 'Rook/Cannon',
	'bishop': 'Bishop',
	'dabbaabarider': 'Dabbaaba-rider',
	'alfilrider': 'Alfil-rider',
	'nightrider': 'Nightrider',
	'camelrider': 'Camelrider',
	'queen': 'Queen',
	'dragonking': 'Dragon King',
	'dragonhorse': 'Dragon Horse',

	'pawn': 'Pawn/Soldier',
	'promotedsoldier': 'Promoted Soldier',
	'lance': 'Lance',
	'laurelhorse': 'Laurel Horse',
	'silvergeneral': 'Silver General',
	'goldgeneral': 'Gold General',

	'example1': 'Example Symmetric Piece',
	'reducedexample1': 'Reduced Example Symmetric Piece',
	'example2': 'Example Symmetric Piece',
	'example2augmented': 'Example Asymmetric Piece',
	'example3': 'Example Asymmetric Piece',
	'example4': 'Example Asymmetric Piece',
	'example4_symmetric': 'Example Symmetric Piece',
}

const ALL_DESCRIPTIONS_DICT = {
	'wazir': 'A one-square rook. The name (وَزِير‎) means "minister" in Arabic&mdash;which, incidentally, was borrowed via Turkish as the English word "vizier." This piece was called as such in Tamerlane chess. In xiangqi, the king is replaced by a general (将 jiāng for black and 帅 shuài for red) which moves like a wazir but is limited to the 3&times;3 palace.',
	'ferz': 'A one-square bishop. The name is a shortening of the Classical Persian word "farzin" (فرزین‎), which means "counsellor." This piece existed even in chaturanga; in modern Western chess the much more powerful queen takes its role, and in some European languages "ferz" (or a variation thereof) is still the name given to the modern queen. In xiangqi, this piece is called the advisor (士 shì) and is limited to the 3&times;3 palace. This is also how a checker moves in checkers, though it captures pieces differently, by jumping over the target piece.',
	'dabbaaba': 'A piece that jumps two squares rook-wise. The name (دَبَّابَة) means "siege engine" in medieval Arabic (in modern Arabic it means "tank"). This piece was called as such in Tamerlane chess. The name is spelled in English with varying numbers of a\'s and b\'s, but for whatever reason, the most direct transliteration of the Arabic, which I use here, is rarely seen.',
	'alfil': 'A piece that jumps two squares bishop-wise. The name (الْفِيل) means "the elephant" in Arabic. For some reason we kept the "the" when we imported the name into English for this piece and none of the others. This piece existed even in chaturanga; in modern Western chess it was replaced by the stronger bishop, and in some European languages "alfil" or "fil" (or a variation thereof) is still the name given to the modern bishop. In xiangqi, this piece is called either the elephant (象 xiàng) for black or the minister (相, pronounced the same way) for red, and cannot cross the river and also cannot jump over pieces. Despite being one of the weakest pieces on the board, it gives xiangqi its name.',
	'threeleaper': 'A piece that jumps three squares rook-wise. This is a rare piece and is not found in any major historical chess variants.',
	'knight': 'A piece that jumps in a distinctive $(1,2)$ L-shape. This piece existed even in chaturanga, and hasn\'t changed at all in Western chess. In xiangqi, it is called the horse (马 mǎ) and moves in the same way but cannot jump over pieces. In shōgi it\'s replaced by the forward-only laurel horse.',
	'camel': 'An elongated knight-like piece that moves in $(1,3)$ L shapes. This piece was called as such in Tamerlane chess; there it was called the Arabic word for (جَمَل, jamal).',
	'king': 'A piece that moves one square rook-wise or one square bishop-wise. The goal in chess is to checkmate this piece. This piece existed even in chaturanga, and hasn\'t changed at all in Western chess or in shōgi (where it is called the king general, 王将 ōshō). In xiangqi the general has a more restricted wazir movement.',
	'fbHsD': 'A constructed piece used here for demonstration. A symmetric piece with movement set $\\{(2,0), (0,3)\\}$',
	'narrowknight': 'Like a knight, but can only go in the directions that are more vertical than they are horizontal.',
	'wideknight': 'Like a knight, but can only go in the directions that are more vertical than they are horizontal.',

	'rook': 'A piece that slides along a row or column. This piece existed even in chaturanga, and hasn\'t changed at all in Western chess or in xiangqi (where it is called the chariot, 车 jū). Xiangqi also introduces a new piece that moves the same way, the cannon (炮 pào), but must leap over a piece in order to capture. Meanwhile, in shōgi, the rook was replaced by the forward-only lance, but the rook was also reintroduced into the game in the 1200s as a new piece, the flying chariot (飛車 hisha).',
	'bishop': 'A piece that slides along any 45° diagonal. This piece appeared in Courier Chess, known as the eponymous courier (Kurier). But when it was reincorporated into standard chess, it ended up replacing the weak alfil piece instead of being a new piece. In shōgi the piece was added in the 1200s as an additional piece, known simply as the angle-mover (角行 kakugyō).',
	'dabbaabarider': 'A piece that can repeat a dabbaaba move in the same direction until it hits something.',
	'alfilrider': 'A piece that can repeat an alfil move in the same direction until it hits something.',
	'nightrider': 'A piece that can repeat a knight move in the same direction until it hits something. Note that the name is nightrider, not knightrider, probably because it just sounds cooler. This is a pretty popular piece within chess variants, even if it\'s not from any of the most historically impactful chess variant. If you\'re looking for a simple chess variant to play, try playing an ordinary game of chess but where knights are replaced by nightriders.',
	'camelrider': 'A piece that can repeat a camel move in the same direction until it hits something.',
	'queen': 'A piece that can move as a rook or a bishop. The most powerful piece in Western chess, it took the place of the much less powerful ferz in chaturanga. The original name of "ferz" or "counsellor" was gradually phased out in favor of "lady" or "queen" over several centuries in medieval Europe, and the piece\'s movement was updated to the modern queen movement in roughly the 1400s, possibly inspired by real-life powerful queens like Queen Isabella who ruled Spain in the late 1400s.',
	'dragonking': 'A rook that can also move like a ferz. In shōgi, even rooks and bishops can promote, not just pawns, and this is what the rook promotes into. The name in Japanese is 竜王 (ryūō).',
	'dragonhorse': 'A bishop that can also move like a wazir. In shōgi, even rooks and bishops can promote, not just pawns, and this is what the bishop promotes into. The name in Japanese is 竜馬 (ryūma). Which is a little confusing because it\'s unrelated to both the dragon king (promoted rook) and the laurel horse, but shares one character of its name with each of those pieces.',

	'pawn': 'A piece that can move one square forward. Pawns in Western chess move diagonally to capture, and in this form this piece existed even in chaturanga. In the Europe in the 1400s, the pawn gained a double move if it starts on the second row. Regardless, we\'re considering neither capture nor double moves here. The equivalent piece is called a soldier (歩兵 fuhyō)  in both shōgi, and captures the same way that it moves. In xiangqi, the piece is identical to the shōgi piece until it crosses the river (for our purposes, I classify this as a different piece, the "Promoted Soldier"). It has different names depending on which side it\'s on: 兵 (bīng) for red and 卒 (zú) for black.',
	'promotedsoldier': 'A piece that can move one square forward or one square sideways. In xiangqi, once a pawn crosses the river, it is allowed to move sideways in addition to its forward move. Once it reaches the end of the board, it does not promote again; it can effectively only move left and right at that point.',
	'lance': 'A rook that can only move forward. Called fragrant chariot (香車 kyōsha) in Japanese; I have no idea where the English name "lance" came from, though the motion of always moving forward feels reasonably lance-like. Its movement and starting location on the board suggests that it evolved from the rook in other versions of chess, before the original rook was reintroduced into the game.',
	'laurelhorse': 'A knight that can only move in the forwardmost two directions. In English when specifically talking about shōgi and there\'s no possibility of confusion with other knights, it\'s often just called knight itself. In Japanese the name is 桂馬 (keima)&mdash;the first word is often translated as "laurel" but more specifically can refer to a few different Japanese plants: the katsura/Japanese Judas tree, the osmanthus, or the cassia/Chinese cinnamon tree. Its movement and starting location on the board suggests that it evolved from the knight in other versions of chess.',
	'silvergeneral': 'A ferz that can also move forward like a wazir (i.e. like a pawn). The English name is a translation of the Japanese name 金将 (kinshō).',
	'goldgeneral': 'A wazir that can also move forward like a ferz. The English name is a translation of the Japanese name 銀将 (ginshō).',

	'example1': 'Symmetric Piece $\\{(3,2),(4,3),(5,1)\\}$',
	'reducedexample1': 'Symmetric Piece $\\{(1,1),(0,1)\\}$, the reduced version of $\\{(3,2),(4,3),(5,1)\\}$',
	'example2': 'Symmetric Piece $\\{(3,3),(0,6)\\}$',
	'example2augmented': 'Symmetric Piece $\\{(3,3),(0,6)\\}$ with additional asymmetric move $\{(1,3)\}$',
	'example3': 'Asymmetric Piece $\\{(1,1),(1,2),(1,3),(1,4)\\}$',
	'example4': 'Asymmetric Piece $\\{(1,2),(-1,2),(1,3)\\}$',
	'example4_symmetric': 'Symmetric Piece $\\{(1,2),(-1,2),(1,3)\\}$',
}