import { describe, it, expect } from 'vitest';
import { getSadReply } from '@/lib/insurance-data';
describe('SAD query routing',()=>{
 it('does not treat hi embedded in a word as a greeting',()=>{expect(getSadReply('something unrelated')).toBe(getSadReply('unrecognised question'));expect(getSadReply('something unrelated')).not.toBe(getSadReply('hi'));});
 it('routes complaint queries before generic policy queries',()=>{expect(getSadReply('complaint about my policy')).toBe(getSadReply('complaint'));expect(getSadReply('complaint about my policy')).not.toBe(getSadReply('policy'));});
});
