import { describe, it, expect } from 'vitest';
import { getVaskoReply } from '@/lib/insurance-data';
describe('VASKO query routing',()=>{
 it('does not treat hi embedded in a word as a greeting',()=>{expect(getVaskoReply('something unrelated')).toBe(getVaskoReply('unrecognised question'));expect(getVaskoReply('something unrelated')).not.toBe(getVaskoReply('hi'));expect(getVaskoReply('hi')).toContain('VASKO');});
 it('routes complaint queries before generic policy queries',()=>{expect(getVaskoReply('complaint about my policy')).toBe(getVaskoReply('complaint'));expect(getVaskoReply('complaint about my policy')).not.toBe(getVaskoReply('policy'));});
});
