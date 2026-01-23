import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import type { InfoLineProps, OwnerProfileCardProps } from "./types";

export function OwnerProfileCard({ profile, onEdit }: OwnerProfileCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Данные владельца</Text>
      <InfoLine label="Имя" value={profile.ownerName} />
      <InfoLine label="Email" value={profile.email} />
      <InfoLine label="Телефон" value={profile.phone} />
      <InfoLine label="Город" value={profile.city} />
      <TouchableOpacity style={styles.button} onPress={onEdit}>
        <Text style={styles.buttonText}>Редактировать профиль</Text>
      </TouchableOpacity>
    </View>
  );
}

function InfoLine({ label, value }: InfoLineProps) {
  return (
    <View style={styles.infoLine}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value?.trim() || "Не указано"}</Text>
    </View>
  );
}
