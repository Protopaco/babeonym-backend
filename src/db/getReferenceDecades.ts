import { pool } from '../utils/dbController.js';

export default async (): Promise<Decade[]> => {
    const { rows } = await pool.query<Decade>(`SELECT * FROM get_reference_decades();`);
    return rows;
}

export interface Decade {
    id: number,
    decade: number,
    label: string
}
;