import io.github.treesitter.jtreesitter.Language;
import io.github.treesitter.jtreesitter.bet.TreeSitterBet;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

public class TreeSitterBetTest {
    @Test
    public void testCanLoadLanguage() {
        assertDoesNotThrow(() -> new Language(TreeSitterBet.language()));
    }
}
