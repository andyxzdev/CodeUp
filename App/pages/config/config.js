import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


// Componente para um item de lista único (reutilizável)
const SettingsItem = ({ iconName, title, onPress }) => {
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      {/* Bloco da Esquerda: Ícone + Título */}
      <View style={styles.itemLeft}>
        <Ionicons name={iconName} size={24} color="#555" />
        <Text style={styles.itemTitle}>{title}</Text>
      </View>
      
      {/* Seta de Navegação da Direita */}
      <Ionicons name="chevron-forward" size={20} color="#aaa" />
    </TouchableOpacity> 
  );
};
// Dados do Menu (Opções)
const menuItems = [
    { id: '1', title: 'Editar Perfil', icon: 'person-outline', route: '/edit-profile' },
    { id: '2', title: 'Privacidade e Segurança', icon: 'lock-closed-outline', route: '/privacy' },
    { id: '3', title: 'Notificações', icon: 'notifications-outline', route: '/notifications' },
    { id: '4', title: 'Idioma', icon: 'language-outline', route: '/language' },
    { id: '5', title: 'Ajuda e Suporte', icon: 'help-circle-outline', route: '/help' },
    { id: '6', title: 'Termos e Políticas', icon: 'document-text-outline', route: '/terms' },
];

export default function config() { // Use Home ou o nome da função que está carregando
  
  // Função que será chamada quando o usuário sair
  const handleLogout = () => {
    alert('Saindo da conta...');
    // Aqui você adicionaria a lógica real de logout (limpar token, etc.)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Configurações</Text>

      {/* Lista de Opções */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SettingsItem 
            iconName={item.icon}
            title={item.title}
            onPress={() => console.log('Navegar para:', item.route)} // Ações futuras
          />
        )}
        style={styles.list}
      />

      {/* Botão Sair da Conta */}
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f9f9f9', 
    padding: 20, 
    paddingTop: 60, // Espaço para o topo
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  list: {
    flexGrow: 0, // Garante que a FlatList ocupe apenas o espaço necessário
  },
  
  // Estilos do SettingsItem
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },

  // Estilos do Botão Sair
  logoutButton: {
    marginTop: 40,
    backgroundColor: '#fff', 
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e74c3c', // Borda vermelha
    alignItems: 'center',
  },
  logoutText: {
    color: '#e74c3c', // Texto vermelho
    fontSize: 18,
    fontWeight: '600',
  },
});