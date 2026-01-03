import io.github.treesitter.jtreesitter.Language;
import io.github.treesitter.jtreesitter.betwork.TreeSitterBetwork;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

public class TreeSitterBetworkTest {
    @Test
    public void testCanLoadLanguage() {
        assertDoesNotThrow(() -> new Language(TreeSitterBetwork.language()));
    }
}
