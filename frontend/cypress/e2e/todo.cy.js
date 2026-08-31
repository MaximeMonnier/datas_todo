/**
 * Test "Full-Stack" : vrais serveurs Django + React, vraie base de developpement.
 * Aucun appel reseau n'est simule ici : ce qui est verifie, c'est que les deux
 * applications communiquent reellement.
 */
describe("Parcours critique complet de la To-Do List", () => {
  // Identifiants du vrai utilisateur cree en base par `manage.py seed_e2e`.
  const UTILISATEUR = "e2e_user";
  const MOT_DE_PASSE = "e2e_password123";
  const CATEGORIE = "Projet Alpha";
  const TACHE = "Déployer la V1";

  beforeEach(() => {
    // Remet la base de dev dans un etat connu : l'utilisateur de test existe,
    // et la categorie/les taches du scenario sont supprimees pour que le test
    // soit rejouable a l'infini (le nom de categorie est unique en base).
    cy.exec("cd ../backend && .venv/bin/python manage.py seed_e2e");
  });

  it("connexion, creation, filtrage, completion puis suppression", () => {
    // --- 1. La page d'accueil ---
    cy.visit("/");

    // --- 2. Connexion avec un vrai utilisateur de la BDD Django ---
    cy.get("[data-cy=login-username]").type(UTILISATEUR);
    cy.get("[data-cy=login-password]").type(MOT_DE_PASSE);
    cy.get("[data-cy=login-submit]").click();
    // On est bien passe cote application
    cy.contains("Ma To-Do List par Catégories").should("be.visible");

    // --- 3. Creation de la categorie "Projet Alpha" ---
    cy.get("[data-cy=category-input]").type(CATEGORIE);
    cy.get("[data-cy=category-submit]").click();
    // CategoryForm recharge la page : on attend que la categorie remonte du
    // backend et apparaisse dans le menu deroulant du formulaire de tache.
    cy.get("[data-cy=task-category]").should("contain", CATEGORIE);

    // --- 4. Creation de la tache rattachee a cette categorie ---
    cy.get("[data-cy=task-input]").type(TACHE);
    cy.get("[data-cy=task-category]").select(CATEGORIE);
    cy.get("[data-cy=task-submit]").click();

    // --- 5. La tache apparait dans la liste generale ---
    cy.contains("[data-cy=task-item]", TACHE).should("be.visible");

    // --- 6. Filtrage sur la seule categorie "Projet Alpha" ---
    cy.get("[data-cy=category-filter]").select(CATEGORIE);

    // --- 7. La tache est toujours visible (et c'est la seule affichee) ---
    cy.get("[data-cy=task-item]").should("have.length", 1);
    cy.contains("[data-cy=task-item]", TACHE).should("be.visible");

    // --- 8. On la marque comme terminee et on valide le changement visuel ---
    cy.contains("[data-cy=task-item]", TACHE)
      .find("[data-cy=task-checkbox]")
      .check();
    cy.contains("[data-cy=task-item]", TACHE)
      .find("[data-cy=task-label]")
      .should("have.class", "line-through");

    // --- 9. Suppression : la tache disparait definitivement de l'ecran ---
    cy.contains("[data-cy=task-item]", TACHE)
      .find("[data-cy=task-delete]")
      .click();
    cy.contains("[data-cy=task-item]", TACHE).should("not.exist");
  });
});
