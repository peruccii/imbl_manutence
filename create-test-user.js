const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Hash da senha para o usuário teste
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    // Cria usuário admin
    const adminUser = await prisma.user.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Admin Teste',
        email: 'admin@teste.com',
        telephone: '11999999999',
        cpf: '12345678901',
        address: 'Endereço Teste',
        password: hashedPassword,
        typeUser: 'ADMIN'
      }
    });
    
    // Cria usuário normal
    const normalUser = await prisma.user.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Usuário Teste',
        email: 'user@teste.com',
        telephone: '11888888888',
        cpf: '98765432109',
        address: 'Endereço Usuário',
        password: hashedPassword,
        typeUser: 'USER'
      }
    });
    
    console.log('Usuários criados com sucesso!');
    console.log('Admin:', {
      email: 'admin@teste.com',
      password: '123456',
      type: 'ADMIN'
    });
    console.log('User:', {
      email: 'user@teste.com', 
      password: '123456',
      type: 'USER'
    });
    
  } catch (error) {
    console.error('Erro ao criar usuários:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
