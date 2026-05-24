import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

// ==========================================
// 1. MODELO: USUÁRIO / INTEGRANTE
// ==========================================
class Usuario {
    private String nome;
    private String rm;
    private int pontuacao;

    public Usuario(String nome, String rm) {
        this.nome = nome;
        this.rm = rm;
        this.pontuacao = 0; // Começa com 0 pontos
    }

    public void adicionarPontos(int pontos) {
        this.pontuacao += pontos;
        System.out.println("🎉 " + nome + " ganhou " + pontos + " pontos! Pontuação atual: " + this.pontuacao);
    }

    // Getters e Setters
    public String getNome() { return nome; }
    public String getRm() { return rm; }
    public int getPontuacao() { return pontuacao; }
}

// ==========================================
// 2. MODELO: DESAFIO ECOLÓGICO (GAMIFICAÇÃO)
// ==========================================
class Desafio {
    private int id;
    private String titulo;
    private String descricao;
    private int recompensaPontos;
    private boolean validado;

    public Desafio(int id, String titulo, String descricao, int recompensaPontos) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.recompensaPontos = recompensaPontos;
        this.validado = false;
    }

    public void realizarValidacaoComunitaria(int votosPositivos) {
        // Regra de negócio do FAQ: Precisa de validação externa para evitar fraudes
        if (votosPositivos >= 3) {
            this.validado = true;
            System.out.println("✅ O desafio '" + titulo + "' foi validado com sucesso pela comunidade!");
        } else {
            System.out.println("⚠️ Validação pendente ou insuficiente para o desafio: " + titulo);
        }
    }

    // Getters
    public int getId() { return id; }
    public String getTitulo() { return titulo; }
    public String getDescricao() { return descricao; }
    public int getRecompensaPontos() { return recompensaPontos; }
    public boolean isValidado() { return validado; }
}

// ==========================================
// 3. CLASSE PRINCIPAL: ECOSSISTEMA SOUL UP
// ==========================================
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        List<Desafio> listaDesafios = new ArrayList<>();

        // Inicializando os integrantes do grupo como usuários do sistema
        Usuario usuarioAtivo = new Usuario("Raphael Tavares", "569767");

        // Massa de dados de testes (Desafios baseados nas missões reais do site)
        listaDesafios.add(new Desafio(1, "Mutirão de Limpeza", "Recolher resíduos plásticos no parque local.", 150));
        listaDesafios.add(new Desafio(2, "Gincana de Reciclagem", "Separar 10kg de papelão ou vidro no bairro.", 200));
        listaDesafios.add(new Desafio(3, "Plantio Urbano", "Plantar 3 mudas de árvores nativas da região.", 300));

        System.out.println("=================================================");
        System.out.println("🌿 BEM-VINDO AO SISTEMA DE GESTÃO - SOUL UP 🌿");
        System.out.println("=================================================");
        System.out.println("Usuário Logado: " + usuarioAtivo.getNome() + " (RM: " + usuarioAtivo.getRm() + ")");
        System.out.println("-------------------------------------------------");

        int opcao = 0;
        do {
            System.out.println("\n[1] Listar Desafios Disponíveis (Mestre da IA)");
            System.out.println("[2] Concluir e Validar um Desafio (Comunidade)");
            System.out.println("[3] Ver Meu Perfil e Pontuação");
            System.out.println("[4] Sair do Sistema");
            System.out.print("Escolha uma opção: ");
            opcao = scanner.nextInt();

            switch (opcao) {
                case 1:
                    System.out.println("\n--- 🤖 DESAFIOS RECOMENDADOS PELA IA ---");
                    for (Desafio d : listaDesafios) {
                        String status = d.isValidado() ? "[CONCLUÍDO]" : "[DISPONÍVEL]";
                        System.out.println(d.getId() + ". " + d.getTitulo() + " - " + d.getDescricao() + " | Recompensa: " + d.getRecompensaPontos() + " XP " + status);
                    }
                    break;

                case 2:
                    System.out.print("\nDigite o ID do desafio que você realizou: ");
                    int idEscolhido = scanner.nextInt();
                    
                    Desafio desafioSelecionado = null;
                    for (Desafio d : listaDesafios) {
                        if (d.getId() == idEscolhido) {
                            desafioSelecionado = d;
                            break;
                        }
                    }

                    if (desafioSelecionado != null) {
                        if (desafioSelecionado.isValidado()) {
                            System.out.println("❌ Este desafio já foi concluído e pontuado!");
                        } else {
                            System.out.println("Simulando Validação Comunitária por Proximidade...");
                            System.out.print("Quantos moradores locais confirmaram a ação por foto? ");
                            int votos = scanner.nextInt();
                            
                            desafioSelecionado.realizarValidacaoComunitaria(votos);

                            if (desafioSelecionado.isValidado()) {
                                usuarioAtivo.adicionarPontos(desafioSelecionado.getRecompensaPontos());
                            }
                        }
                    } else {
                        System.out.println("❌ Desafio não encontrado.");
                    }
                    break;

                case 3:
                    System.out.println("\n--- 🧑‍💻 STATUS DO USUÁRIO ---");
                    System.out.println("Nome: " + usuarioAtivo.getNome());
                    System.out.println("RM Acadêmico: " + usuarioAtivo.getRm());
                    System.out.println("Score Ecológico: " + usuarioAtivo.getPontuacao() + " pontos");
                    break;

                case 4:
                    System.out.println("\n🌳 Soul Up: Salvando o planeta um bloco de código por vez. Até logo!");
                    break;

                default:
                    System.out.println("❌ Opção inválida!");
                    break;
            }
        } while (opcao != 4);

        scanner.close();
    }
}