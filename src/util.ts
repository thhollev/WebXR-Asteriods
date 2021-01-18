
/**
 * @author Thomas Hollevoet
 */

export class Util {
    public static random(min: number, max: number): number{
        return Math.random() * (max-min) + min;
    }
}
