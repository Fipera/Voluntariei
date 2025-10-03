import React, { useState, useMemo } from 'react';
import { Modal, View, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { SKILL_GROUPS } from '@/utils/constants/voluntarySkills';
import { X, Plus, Check } from 'lucide-react-native';
import { Image } from '@/components/ui/image';
import { SKILL_IMAGE_MAP, DEFAULT_SKILL_IMAGE } from '@/utils/constants/voluntarySkillImages';

interface SkillsEditorProps {
  value: string[];
  onChange: (skills: string[]) => void;
  max?: number;
  min?: number;
}

export const SkillsEditor: React.FC<SkillsEditorProps> = ({ value, onChange, max = 5, min = 1 }) => {
  const [open, setOpen] = useState(false);

  function toggle(skill: string){
    const exists = value.includes(skill);
    if(exists){
      onChange(value.filter(s=>s!==skill));
    } else {
      if(value.length >= max) return; // ignore if full
      onChange([...value, skill]);
    }
  }

  function remove(skill: string){
    if(value.length <= min) return; // enforce min on removal from chip (user can still open modal to swap)
    onChange(value.filter(s=>s!==skill));
  }

  const remaining = max - value.length;

  const labelMap = useMemo(()=>{
    const map: Record<string,string> = {};
    SKILL_GROUPS.forEach(g=>g.skills.forEach(s=>{ map[s.value]=s.label; }));
    return map;
  },[]);

  return (
    <View style={{ gap: 12 }}>
      <Text style={{ fontSize:16, fontFamily:'Nunito-Bold', color:'#173663' }}>Habilidades</Text>
      <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8 }}>
        {value.map(skill=> (
          <View key={skill} style={{ flexDirection:'row', alignItems:'center', backgroundColor:'#173663', paddingHorizontal:12, height:32, borderRadius:16 }}>
            <Text style={{ color:'#fff', fontSize:13, fontFamily:'Nunito-Regular', marginRight:6 }}>{labelMap[skill] || skill}</Text>
            {value.length > min && (
              <Pressable onPress={()=>remove(skill)} hitSlop={10}>
                <X size={16} color="#fff" />
              </Pressable>
            )}
          </View>
        ))}
        {value.length < max && (
          <Pressable onPress={()=>setOpen(true)} style={{ borderWidth:1, borderColor:'#173663', borderStyle:'dashed', paddingHorizontal:12, height:32, borderRadius:16, flexDirection:'row', alignItems:'center', gap:4 }}>
            <Plus size={16} color="#173663" />
            <Text style={{ fontSize:13, fontFamily:'Nunito-Regular', color:'#173663' }}>Adicionar ({remaining})</Text>
          </Pressable>
        )}
      </View>
      <Text style={{ fontSize:12, fontFamily:'Nunito-Regular', color:'#4A5568' }}>{value.length}/{max} selecionadas</Text>

      <Modal visible={open} animationType='slide' onRequestClose={()=>setOpen(false)}>
        <View style={{ flex:1, backgroundColor:'#f7f7f7' }}>
          <View style={{ paddingTop:48, paddingHorizontal:20, paddingBottom:12, flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:'#fff', borderBottomWidth:1, borderColor:'#E2E8F0' }}>
            <Text style={{ fontSize:18, fontFamily:'Nunito-Bold', color:'#173663' }}>Selecionar Habilidades</Text>
            <Pressable onPress={()=>setOpen(false)} hitSlop={10}><X size={22} color='#173663' /></Pressable>
          </View>
          <ScrollView contentContainerStyle={{ padding:20, paddingBottom:120 }}>
            <VStack style={{ gap:40 }}>
              {SKILL_GROUPS.map(group=> (
                <VStack key={group.key} style={{ gap:16 }}>
                  <HStack style={{ gap:8, alignItems:'center' }}>
                    <Text style={{ fontSize:20 }}>{group.icon}</Text>
                    <Text style={{ fontSize:20, fontFamily:'Nunito-Bold', color:'#173663' }}>{group.title}</Text>
                  </HStack>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 8 }}>
                    <HStack style={{ gap:20 }}>
                      {group.skills.map(s=>{
                        const active = value.includes(s.value);
                        const full = !active && value.length >= max;
                        const imgSrc = SKILL_IMAGE_MAP[s.value] || DEFAULT_SKILL_IMAGE;
                        return (
                          <Pressable key={s.value} onPress={()=>toggle(s.value)} disabled={full} style={{ width:82, alignItems:'center', opacity: full ? 0.35 : 1 }}>
                            <View
                              style={{
                                width:82,
                                height:82,
                                borderRadius:41,
                                overflow:'hidden',
                                justifyContent:'center',
                                alignItems:'center',
                                backgroundColor: '#CBD5E0',
                                position:'relative'
                              }}
                            >
                              <Image alt={s.label} source={imgSrc} style={{ width:'100%', height:'100%' }} />
                              {active && (
                                <View style={{ position:'absolute', top:0, left:0, right:0, bottom:0, backgroundColor:'rgba(23,54,99,0.55)', justifyContent:'center', alignItems:'center' }}>
                                  <Check size={32} color="#fff" strokeWidth={3} />
                                </View>
                              )}
                            </View>
                            <Text style={{ marginTop:4, fontSize:12, fontFamily:'Nunito-Regular', textAlign:'center', color:'#1A202C' }} numberOfLines={2}>{s.label}</Text>
                          </Pressable>
                        );
                      })}
                    </HStack>
                  </ScrollView>
                </VStack>
              ))}
            </VStack>
          </ScrollView>
          <View style={{ position:'absolute', left:0, right:0, bottom:0, padding:16, backgroundColor:'#fff', borderTopWidth:1, borderColor:'#E2E8F0' }}>
            <Button onPress={()=>setOpen(false)} style={{ width:310, height:44, borderRadius:12, alignSelf:'center', backgroundColor:'#173663', flexDirection:'row', justifyContent:'center', alignItems:'center' }}>
              <Text style={{ fontSize:16, fontFamily:'Nunito-Bold', color:'#fff' }}>Concluir</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};
