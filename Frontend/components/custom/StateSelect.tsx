import React, { useState, useMemo } from 'react';
import { Modal, View, Pressable, TouchableWithoutFeedback, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { BRAZIL_STATES } from '@/utils/constants/states';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { ChevronDown } from 'lucide-react-native';

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  fullName?: boolean; // if true store full name instead of code
  height?: number;
  showCodeAndName?: boolean; // display e.g. SP - São Paulo inside field
  containerStyle?: any; // override outer pressable style
}

export const StateSelect: React.FC<Props> = ({
  value,
  onChange,
  placeholder='Estado',
  disabled,
  fullName=false,
  height=52,
  showCodeAndName=false,
  containerStyle
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const options = useMemo(() => {
    const term = search.toLowerCase();
    return BRAZIL_STATES.filter(s => s.name.toLowerCase().includes(term) || s.code.toLowerCase().includes(term));
  }, [search]);

  function handleSelect(code: string) {
    const st = BRAZIL_STATES.find(s => s.code === code);
    if (!st) return;
    onChange(fullName ? st.name : st.code);
    setOpen(false);
    setSearch('');
  }

  function displayValue() {
    if (!value) return '';
    const st = BRAZIL_STATES.find(s => s.code === value || s.name === value);
    if (!st) return value;
    return showCodeAndName ? `${st.code} - ${st.name}` : st.code;
  }

  return (
    <>
      <Pressable
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={[{
          width: '100%',
          height,
          borderWidth: 1,
          borderColor: '#B7B7B7',
          borderRadius: 8,
          backgroundColor: disabled ? '#F1F5F9' : '#FDFDFD',
          paddingHorizontal: 12,
          flexDirection: 'row',
          alignItems: 'center',
          // shadow iOS
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 2,
          // shadow Android
          elevation: 2,
        }, containerStyle]}
        android_ripple={{ color: '#E2E8F0' }}
      >
        <Text style={{ fontSize: 14, fontFamily: 'Nunito-Regular', color: value ? '#1a202c' : '#64748b' }}>
          {displayValue() || placeholder}
        </Text>
        <ChevronDown size={18} color="#173663" style={{ marginLeft: 'auto' }} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback onPress={() => setOpen(false)}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end' }}>
              <TouchableWithoutFeedback>
                <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '85%', paddingHorizontal: 16, paddingTop: 16, paddingBottom: Platform.OS === 'ios' ? 40 : 24 }}>
                  <Text style={{ fontSize: 16, fontFamily: 'Nunito-Bold', marginBottom: 8, color: '#173663', textAlign: 'center' }}>Selecione o Estado</Text>
                  <Input className="w-full rounded-lg border-[#D9D9D9] mb-3" style={{ height: 44 }}>
                    <InputField value={search} onChangeText={setSearch} placeholder="Buscar" className="text-sm" />
                  </Input>
                  <FlatList
                    data={options}
                    keyExtractor={(item) => item.code}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item }) => (
                      <Pressable onPress={() => handleSelect(item.code)} style={{ paddingVertical: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, fontFamily: 'Nunito-Regular', color: '#1a202c' }}>{item.code} - {item.name}</Text>
                      </Pressable>
                    )}
                    ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#E2E8F0' }} />}
                    style={{ borderRadius: 12 }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};
